import { Disclosure } from "@headlessui/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PageData } from "../../pages/p/[pid]";
import { trpc } from "../../utils/trpc";
import BlockSelector from "../block-selector";
import Notes from "../note-block";
import Timer from "../timer";
import TodoList from "../todo";
import { AuthorContext } from "../../context/authorContext";
import YouTubeBlockHandler from "../youtube-block";
import SpotifyBlockHandler from "../spotify-block";

interface BlockContainerProps
{
	id: number;
	className: string;
	pageData: PageData;
	user: User;
}

const BlockContainer: FC<BlockContainerProps> = (props) => 
{
	const isUserAuthor = useContext(AuthorContext)
	const pid = useRouter().query.pid as string

	const { pageData, id: blockId } = props
	const utils = trpc.useContext()

	
	const updateData = trpc.useMutation(
		["pages.updateData"],
		{
			onSuccess: async () =>
			{
				await utils.refetchQueries(["pages.getData"])
			}
		})
		
	/* This function is wrapped in the useCallback hook to effectively cache the function
	 * unless one of the variables in the dependency array changes
  */
	const updateBlockHandler = useCallback(async () =>
	{
		const { schema, layout, blocks, userPreferences } = pageData;
		const input = {
			pid,
			data: {
				schema,
				layout,
				blocks,
				userPreferences: userPreferences 
			},
		}

		await updateData.mutateAsync(input)
		parseUserData()
	}, [pageData])

	/* This variable is wrapped in a useMemo hook to effectively cache the data unless the 
	* variable userData in the dependency array changes
	*/	
	const initialContent = useMemo(() => 
	{
		if (isUserAuthor) 
		{
			return(	
				<>
					<Disclosure >
						{({ open }) => (
							<>
								<Disclosure.Button>
									<h1 className={"text-7xl"}>+</h1>
								</Disclosure.Button>
								{open && 
						<BlockSelector 
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							updateBlock={updateBlockHandler} 
							resetValue={() => setContent(initialContent)} 
							pageData={pageData}
							blockId={blockId}
						/>
						
								}
							</>
						)}
					</Disclosure>
				</> 
			)
		}
		else 
		{
			return (<></>)
		}
	}, [pageData, blockId, updateBlockHandler, isUserAuthor])
	
	const [content, setContent] = useState(initialContent)	
	
	/* This function is wrapped in the useCallback hook to effectively cache the function
	 * unless one of the variables in the dependency array changes
  */
	const parseUserData = useCallback(() => 
	{
		const blockData = pageData.blocks[blockId]!.block

		switch(pageData.blocks[blockId]?.block.type) 
		{
		case "Notes":
			setContent(<Notes blockData={blockData} pageData={pageData}/>);
			break;
		case "Timer":
			setContent(<Timer blockData={blockData} pageData={pageData}/>);
			break;
		case "TodoList":
			setContent(<TodoList blockData={blockData} pageData={pageData} />);
			break;
		case "YouTube":
			setContent(<YouTubeBlockHandler blockData={blockData} pageData={pageData}/>);
			break;
		case "Spotify":
			setContent(<SpotifyBlockHandler blockData={blockData} pageData={pageData}/>);
			break;
		case "empty":
			setContent(initialContent);
			break;
		}
	}, [pageData, blockId, initialContent])
	
	useEffect(() => 
	{
		parseUserData()
	}, [parseUserData])
	
	if (!pageData.blocks[blockId]) 
	{
		return <></>;
	}
	
	const resetBlockContent = async (pid: string) => 
	{
		pageData.blocks[blockId]!.block.type = "empty";
		pageData.blocks[blockId]!.block.content = "";
		pageData.blocks[blockId]!.block.duration = 0;


		const { schema, layout, blocks, userPreferences } = pageData;
		const input = {
			pid,
			data: {
				schema,
				layout,
				blocks,
				userPreferences
			},
		}

		await updateData.mutateAsync(input)
		setContent(initialContent)
		
	}	

	return(
		<>
			<div className={"flex w-10/12 h-40 lg:h-5/6 lg:p-5 mx-auto my-auto border-gray-800 border-4 rounded-lg border-dashed bg-slate-100/40 " + props.className }>
				<div className={"flex w-full h-full items-center justify-center  "}>

					{content}
				</div>
				{(isUserAuthor && content !== initialContent) && (
					<button 
						className={"float-right flex "}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises 
						onClick={() => resetBlockContent(pid)}>
					x
					</button>

				)}
			</div>
		</>
	)
}

export default BlockContainer;