import { User } from '@prisma/client';
import React, { useRef, useState, useEffect, FC, ReactElement, useContext } from 'react';
import { PageData } from '../../pages/p/[pid]';
import { trpc } from '../../utils/trpc';
import { AuthorContext } from '../../context/authorContext';

interface EditableElementProps {
	onChange: (value: string) => void;
	children: ReactElement
}

const EditableElement: FC<EditableElementProps> = (props) => 
{
	const { onChange } = props;
	const element = useRef(null);
	let child = props.children

	const onMouseUp = () => 
	{
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
		const value: string = (element.current as any)?.value || (element.current as any)?.innerText;
		onChange(value);
	};

	useEffect(() => 
	{
		const value: string = (element.current as any)?.value || (element.current as any)?.innerText;
		onChange(value);
	});

	const isUserAuthor = useContext(AuthorContext)


	child = React.cloneElement(child, {
		contentEditable: isUserAuthor,
		suppressContentEditableWarning: true,
		ref: element,
		onKeyUp: onMouseUp
	});

	return child;
};

interface NoteBlockProps {
	content?: string | number
	userData?: PageData;
	id?: number
	user?: User
}

// const Notes: FC<NoteBlockProps> = (props) => 
// {
// 	const [value, setValue] = useState<string>("Write Notes here");
// 	const [modified, setModified] = useState<boolean>(false)
// 	const updatePageData = trpc.useMutation(["pages.updateData"])

// 	// eslint-disable-next-line @typescript-eslint/require-await
// 	const  handleChange = async (value: string) => 
// 	{
// 		if(value !== props.content) 
// 		{
// 			setModified(true)
// 		}
// 		else 
// 		{
// 			setModified(false)
// 		}
// 		// if (props.userData.blocks[props.id]) 
// 		// {
// 		// 	props.userData.blocks[props.id].block.content = value

// 		// 	const data = {
// 		// 		id: props.user.pageId,
// 		// 		data: props.userData
// 		// 	}
// 		// 	// await updatePageData.mutateAsync(data)
// 		// }

// 	};


// 	return(
// 		<>
// 			<div className="flex w-full h-full items-center justify-center ">
// 				<EditableElement
// 				// eslint-disable-next-line @typescript-eslint/no-misused-promises
// 					onChange={handleChange}			
// 				>
// 					<div className="w-full h-full p-3 focus:border-none font-serif text-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400  ">
// 						{props.content ? props.content :"Notes go Here!"}
// 					</div>
// 				</EditableElement>
// 				{modified && (
// 					<div className="absolute bottom-0 mt-auto ml-auto">
// 						<button className={""}>
// 							sdfsdf
// 						</button>
// 					</div>
// 				)}
// 			</div>
// 		</>
// 	)
// }

interface NoteProps {
	blockData: {
		id: number,
		type: string,
		content?: string | number

	}
}

const Notes: FC<NoteProps> = (props) => 
{
	return (
		<>
			Notes
			<pre>
				{JSON.stringify(props.blockData)}
			</pre>
		</>
	)
}
export default Notes;

