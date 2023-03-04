import React, { useRef, useState, useEffect, FC, ReactElement, useContext } from 'react';
import { PageData } from '../../pages/p/[pid]';
import { trpc } from '../../utils/trpc';
import { AuthorContext } from '../../context/authorContext';
import { useRouter } from 'next/router';

interface EditableElementProps {
	onChange: (value: string) => void;
	children: ReactElement
}

const EditableElement: FC<EditableElementProps> = (props) => 
{
	const { onChange } = props;
	const element = useRef(null);
	let child = props.children

	const onKeyEntry = () => 
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
		onKeyUp: onKeyEntry
	});

	return child;
};

interface NoteBlockProps {
	pageData: PageData;
	blockData: {
		id: number,
		type: string,
		content: string
	}
}

const Notes: FC<NoteBlockProps> = (props) => 
{
	const pid = useRouter().query.pid as string;
	const [value, setValue] = useState<string>(props.pageData.blocks[props.blockData.id]!.block.content);
	
	const updatePageData = trpc.useMutation(["pages.updateData"])

	const handleChange = (newValue: string) => 
	{
		setValue(newValue)
		// props.pageData.blocks[props.blockData.id]!.block.content = newValue;
	}

	useEffect(() => 
	{
		const update = setInterval(() => 
		{
			if (value === props.pageData.blocks[props.blockData.id]!.block.content) return;

			props.pageData.blocks[props.blockData.id]!.block.content = value;

			const { schema, layout, blocks, userPreferences } = props.pageData;

			const input = {
				pid,
				data: {
					schema,
					layout,
					blocks,
					userPreferences
				}
			}
			void updatePageData.mutateAsync(input)
		}, 2000);

		return () => 
		{
			clearInterval(update);
		};

		
	}, [pid, updatePageData, props.blockData.id]);

	return(
		<>
			<div className="flex w-full h-full items-center justify-center ">
				<EditableElement
					onChange={handleChange}
				>
					<div className="w-full h-full p-3 whitespace-pre-wrap focus:border-none font-serif text-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400  " id="notes">
						{props.blockData.content ? props.blockData.content  :"Notes go Here!"}
					</div>
				</EditableElement>
			</div>
		</>
	)
}


export default Notes;

