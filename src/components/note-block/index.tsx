import { User } from '@prisma/client';
import React,  { useRef, useState, useEffect, FC, ReactElement } from 'react';
import { UserData } from '../../pages/p/[pid]';
import { trpc } from '../../utils/trpc';

interface EditableElementProps 
{
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
		const value: string =( element.current as any)?.value || (element.current as any)?.innerText;
		onChange(value);
	});
	
	child = React.cloneElement(child, {
		contentEditable: true,
		suppressContentEditableWarning: true,
		ref: element,
		onKeyUp: onMouseUp
	});
	
	return child;
};

interface NoteBlockProps 
{
	content?: string,
	userData?: UserData
	id?: number
	user?: User
}

const Notes: FC<NoteBlockProps> = (props) => 
{
	const [value, setValue] = useState("Write Notes here");

	const updatePageData = trpc.useMutation(["pages.updateData"])

	// eslint-disable-next-line @typescript-eslint/require-await
	const  handleChange = async (value: string) => 
	{
		setValue(value);
		// if (props.userData.blocks[props.id]) 
		// {
		// 	props.userData.blocks[props.id].block.content = value
			
		// 	const data = {
		// 		id: props.user.pageId,
		// 		data: props.userData
		// 	}
		// 	// await updatePageData.mutateAsync(data)
		// }

	};


	return(
		<>
			<EditableElement
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onChange={handleChange}			
			>
				<div className="w-full h-full p-3 focus:border-none font-serif text-lg overflow-scroll">
					{props.content ? props.content :"Notes go Here!"}
				</div>
			</EditableElement>
		</>
	)
}

export default Notes;