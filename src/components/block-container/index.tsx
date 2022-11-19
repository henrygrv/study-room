import { Disclosure } from "@headlessui/react";
import { User } from "@prisma/client";
import { FC, ReactNode, useState } from "react";
import { UserData } from "../../pages/p/[pid]";
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

const BlockContainer:FC<BlockContainerProps> = (props) => 
{
	const { userData, id } = props

	const sdf;

	const parseUserData = () => 
	{
		switch(userData.blocks[id]?.block.type) 
		{
		case "notes":
			return(
				<Notes content={userData.blocks[id]?.block.content} userData={userData} id={props.id} user={props.user}/>
			);
		case "timer":
			return(
				<Timer />
			);
		case "todo":
			return(
				<TodoList />
			);
		case "empty":
			return initialContent;
		}
	}
		
	const [content, setContent] = useState(parseUserData())	

	const resetBlockContent = () => 
	{
		setContent(initialContent)
		userData.blocks[id]?.block.type === "none"
		userData.blocks[id]?.block.content === ""

		
		
	}

	const initialContent = (
		<>
			<Disclosure >
				{({ open }) => (
					<>
						<Disclosure.Button>
							<h1 className={"text-7xl"}>+</h1>
						</Disclosure.Button>
						{open && 
						<BlockSelector updateBlock={setContent} resetValue={() => setContent(initialContent)} />
						
						}
					</>
				)}
			</Disclosure>
		</>
	)
	
	

	return(
		<>
			<div className={"flex w-10/12 h-5/6 p-5 mx-auto my-auto border-gray-800 border-4 rounded-lg border-dashed bg-slate-100/40 " + props.className }>
				<div className={"flex w-full h-full items-center justify-center  "}>
					{content}
				</div>
				<button 
					className={"float-right flex"}
					onClick={() => setContent(initialContent)}>
					x
				</button>
			</div>
		</>
	)
}

export default BlockContainer;