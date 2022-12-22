import { Disclosure } from "@headlessui/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { UserData } from "../../pages/p/[pid]";
import { trpc } from "../../utils/trpc";
import BlockSelector from "../block-selector";
import Notes from "../note-block";
import Timer from "../timer";
import TodoList from "../todo";

interface BlockContainerProps
{
	id: number;
	children?: string | ReactNode;
	className: string;
	userData: UserData;
	user: User;
}

const BlockContainer: FC<BlockContainerProps> = (props) => 
{
	const pid = useRouter().query.pid as string

	const { userData, id: blockId } = props
	const utils = trpc.useContext()

	const updateData = trpc.useMutation(
		["pages.updateData"],
		{
			onSuccess: async () =>
			{
				await utils.invalidateQueries(["pages.getData"])
			}
		})

	/* This variable is wrapped in a useMemo hook to effectively cache the data unless the 
	 * variable userData in the dependency array changes
	*/	
	const initialContent = useMemo(() => (
		<>
			<Disclosure >
				{({ open }) => (
					<>
						<Disclosure.Button>
							<h1 className={"text-7xl"}>+</h1>
						</Disclosure.Button>
						{open && 
						<BlockSelector updateBlock={setContent} resetValue={() => setContent(initialContent)} userData={userData}/>
						
						}
					</>
				)}
			</Disclosure>
		</>
	), [userData])

	const [content, setContent] = useState(initialContent)	
	
	/* This function is wrapped in the useCallback hook to effectively cache the function
	 * unless one of the variables in the dependency array changes
  */
	const parseUserData = useCallback(() => 
	{
		switch(userData.blocks[blockId]?.block.type) 
		{
		case "Notes":
			setContent(<Notes content={userData.blocks[blockId]?.block.content} userData={userData} id={props.id} user={props.user}/>);
			break;
		case "Timer":
			setContent(<Timer />);
			break;
		case "TodoList":
			setContent(<TodoList />);
			break;
		case "empty":
			setContent(initialContent);
			break;
		}
	}, [props, userData, blockId, initialContent])

	useEffect(() => 
	{
		parseUserData()
	}, [parseUserData])
	
	const resetBlockContent = async (pid: string) => 
	{
		userData.blocks[blockId].block.type = "empty"
		userData.blocks[blockId].block.content = ""

		const { schema, layout, blocks } = userData;
		const input = {
			pid: pid,
			data: {
				schema: schema,
				layout: layout,
				blocks: blocks,
				userPreferences: {
				
				}
			},
		}

		await updateData.mutateAsync(input)
		setContent(initialContent)
		
	}	

	return(
		<>
			<div className={"flex w-10/12 h-5/6 p-5 mx-auto my-auto border-gray-800 border-4 rounded-lg border-dashed bg-slate-100/40 " + props.className }>
				<div className={"flex w-full h-full items-center justify-center  "}>
					{content}
				</div>
				<button 
					className={"float-right flex"}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises 
					onClick={() => resetBlockContent(pid)}>
					x
				</button>
			</div>
		</>
	)
}

export default BlockContainer;