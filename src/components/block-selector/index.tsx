import {  Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { Dispatch, FC, Fragment, SetStateAction, useState, KeyboardEvent } from "react";
import { UserData } from "../../pages/p/[pid]";
import { trpc } from "../../utils/trpc";
import Notes from "../note-block";
import Timer from "../timer";
import TodoList from "../todo";


interface BlockSelectorProps
{
	updateBlock: Dispatch<SetStateAction<JSX.Element>>,
	resetValue : () => void,
	userData: UserData,
}

const BlockSelector: FC<BlockSelectorProps> = (props) =>
{
	const blocks: {id: number, name: string, content: JSX.Element}[] = [
		{ id: 1, name: "TodoList", content: <TodoList /> },
		{ id: 2, name: "Timer", content: <Timer /> },
		{ id: 3, name: "Notes", content: <Notes  /> }
	];
	
	const utils = trpc.useContext();

	const [selectedBlock, setSelectedBlock] = useState({ content: <>{""}</> });
	const [query, setQuery] = useState("");

	// filters the blocks by the query inputted and removes whitespace via the regex 
	const queriedBlocks = 
		query === ""
			? blocks
			: blocks.filter((block) =>
				block.name
					.toLowerCase()
					.replace(/\s+/g, "")
					.includes(query.toLowerCase().replace(/\s+/g, "")))

	const updateData = trpc.useMutation(
		["pages.updateData"],
		{
			onSuccess: async() => 
			{
				await utils.refetchQueries(["pages.getData"])
			}
		}
	);

	return (
		<div className="fixed w-72">
			<Combobox value={selectedBlock} onChange={setSelectedBlock} >
				{({ open }) => 
					(
						<div className="relative mt-1">
							<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
								<Combobox.Input
									autoFocus
									onBlur={props.resetValue}
									className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
									displayValue={(block: typeof blocks[0]) => block.name}
									onChange={(event) => setQuery(event.target.value)}
									onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => 
									{
										console.log("enter")
										if(event.key === "Enter" && selectedBlock?.content.props.children !== "")
										{
											props.updateBlock(selectedBlock.content)
										}
									}}
								/>
								<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
									<SelectorIcon
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
								</Combobox.Button>
							</div>

							<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{queriedBlocks.length === 0 && query !== "" ? (
									<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Nothing Found.
									</div>
								) : (
									queriedBlocks.map((block, blockIdx) => (
										<Combobox.Option
											key={blockIdx}
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-10 pr-4 ${
													active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
												}`
											}
											value={block}
											onClick={() => 
											{
												if(block.content)
												{
													if (props.userData.blocks[block.id]) 
													{
														props.userData.blocks[block.id].block.type = block.name
														props.updateBlock(block.content)
													}
												}
											}}
											onKeyDown={(event: KeyboardEvent<HTMLLIElement>) => 
											{
												if (event.key === "Enter") 
												{
													if(block.content) 
													{
														props.updateBlock(block.content)
													}
												}
											}}

										>
											{({ selected }) => (
												<>
													<span
														className={`block truncate ${
															selected ? 'font-medium' : 'font-normal'
														}`}
													>
														{block.name === "null" ? "" : block.name}
													</span>
													{selected ? (
														<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
															<CheckIcon className="h-5 w-5" aria-hidden="true" />
														</span>
													) : null}	

												</>
											)}
										</Combobox.Option>
									))
								)}
							</Combobox.Options>
						</div>

					)}
			</Combobox>
		</div>
	)
}
	

export default BlockSelector;