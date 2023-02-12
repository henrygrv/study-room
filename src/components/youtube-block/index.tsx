import { FC, FormEvent, useContext, useState } from "react";
import { DarkThemeContext } from "../../context/themeContext";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { PageData } from "../../pages/p/[pid]";

interface YouTubeBlockProps
{
	pageData: PageData,	
	blockData: {
		id: number,
		type: string,
		content?: string | number

	}
}

const YouTubeBlockHandler: FC<YouTubeBlockProps> = (props) => 
{
	const { darkTheme } = useContext(DarkThemeContext);

	const utils = trpc.useContext();

	const pid = useRouter().query.pid as string;

	const [errorVisible, setErrorVisible] = useState<boolean>(false);

	const updateData = trpc.useMutation(
		["pages.updateData"], 
		{
			onSuccess: async () => 
			{
				await utils.refetchQueries(["pages.getData"])
			}
		}
	);
	
	if(props.blockData.content && typeof(props.blockData.content) === "string") 
	{
		props.blockData.content = props.blockData.content.replace("youtu.be", "youtube.com/embed/")
		return <><YouTubeEmbed src={props.blockData.content}/></>
	}

	const handleLinkSubmission = (e: FormEvent<HTMLFormElement>) => 
	{
		e.preventDefault()

		const $url = (document.getElementById("link-input") as HTMLInputElement).value;
		
		if(!/https:\/\/www\.youtube\.com\/watch\?v=.+|https:\/\/youtu\.be\/tkp-931VLFc/.exec($url)) 
		{
			setErrorVisible(true);
			return;
		}

		setErrorVisible(false);

		props.pageData.blocks[props.blockData.id]!.block.content = $url;
		props.blockData.content = $url;
		
		const { schema, layout, blocks, userPreferences } = props.pageData;

		const input = {
			pid,
			data: {
				schema,
				layout,
				blocks,
				userPreferences 
			},
		}

		void updateData.mutateAsync(input)

	}
	return(
		<>
			<div className="w-full h-full p-4 px-30 align-center items-center justify-center flex flex-row font-serif">

				<div className={`${darkTheme ? "bg-slate-200" : "bg-white"} p-2 rounded-lg drop-shadow-lg `} >
					<form 
						id="youtube-link" 
						onKeyDown={
							(e) => 
							{
								if (e.key === "Enter") 
								{
									e.preventDefault();
									handleLinkSubmission(e);

								}
							}}
						onSubmit={handleLinkSubmission}
					>

						<input 
							id="link-input" 
							type="text"
							defaultValue={"Please enter a YouTube Link"} 
							onClick={(e) => (e.target as HTMLInputElement).select()}
							onFocus={(e) => (e.target as HTMLInputElement).select()}
							className="text-gray-500 p-2 bg-inherit mr-2 focus:text-gray-800" />

						<input
							type="submit"
							className="bg-slate-100 p-2 rounded-lg drop-shadow-sm hover:drop-shadow-md ">

						</input>
					</form>
				</div>

				{errorVisible && (
					<h1 className="text-lg mt-48 absolute text-gray-800" >
						Invalid Youtube Url!
					</h1>
				)}
			</div>
		</>
	)
}

export default YouTubeBlockHandler;

const YouTubeEmbed = (props: {src: string}) => 
{

	return (
		<div className="w-full p-4 h-full px-10">
			<div className="w-full h-full">
				<iframe
					className="w-full h-full rounded-md"
					src={`${props.src.replace('/watch?v=', '/embed/')}`}
				/>
			</div>
		</div>
	)
}