import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { FC, useState, KeyboardEvent, useContext } from "react";
import { PageData } from "../../pages/p/[pid]";
import { trpc } from "../../utils/trpc";
import { DarkThemeContext } from "../../context/themeContext";



interface BlockSelectorProps {
	updateBlock: () => void,
	resetValue: () => void,
	pageData: PageData,
	blockId: number,
}

const BlockSelector: FC<BlockSelectorProps> = (props) => 
{
	const { darkTheme } = useContext(DarkThemeContext);
	const blocks: { id: number, name: string }[] = [
		{ id: 1, name: "TodoList" },
		{ id: 2, name: "Timer", },
		{ id: 3, name: "Notes", },
		{ id: 4, name: "YouTube" },
		{ id: 5, name: "Spotify" },
	];

	const [selectedBlock, setSelectedBlock] = useState({ content: "" });
	const [query, setQuery] = useState<string>("");

	// filters the blocks by the query inputted and removes whitespace via the regex 
	const queriedBlocks =
		query === ""
			? blocks
			: blocks.filter((block) =>
				block.name
					.toLowerCase()
					.replace(/\s+/g, "")
					.includes(query.toLowerCase().replace(/\s+/g, "")))

	const handleBlockSelection = (block: {id: number, name: string}) => 
	{
		props.pageData.blocks[props.blockId]!.block.type = block.name;
		if(block.name in ["Notes, YouTube, Spotify"])
		{
			props.pageData.blocks[props.blockId]!.block.content = "";
		}
		if(block.name === "Timer") 
		{
			props.pageData.blocks[props.blockId]!.block.duration = 0;
		}
		
		props.updateBlock();
	}

	return (
		<div className="absolute mt-1 w-72 font-serif py-6">
			<Combobox value={selectedBlock} onChange={setSelectedBlock} >
				{({ open }) =>
					(
						<div className="relative mt-1">
							<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
								<Combobox.Input
									autoFocus
									onBlur={props.resetValue}
									className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 "
									displayValue={(block: typeof blocks[0]) => block.name}
									onChange={(event) => setQuery(event.target.value)}

	
								/>
								<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
									<SelectorIcon
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
								</Combobox.Button>
							</div>

							<Combobox.Options className=" font-serif absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" >
								{queriedBlocks.length === 0 && query !== "" ? (
									<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Nothing Found.
									</div>
								) : (
									queriedBlocks.map((block, blockIdx) => (
										<Combobox.Option
											key={blockIdx}
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-10 pr-4 ${ active ? `${darkTheme ? "bg-indigo-100 text-indigo-900" : "bg-amber-100 text-amber-900"}` : 'text-gray-900'
												}`
											}
											value={block}
											onClick={() => handleBlockSelection(block)}
											onKeyDown={(e: KeyboardEvent) => 
											{
												if (e.key === "Enter")
												{
													e.preventDefault()
													handleBlockSelection(block);
												}
                      
											}}
										>
											{({ selected }) => (
												<>
													<span
														className={`block truncate ${ selected ? 'font-medium' : 'font-normal'
														}`}
													>
														{block.name === "null" ? "" : block.name}
													</span>
													{selected ? (
														<span className={
															`absolute inset-y-0 left-0 flex items-center pl-3 ${darkTheme ? "text-indigo-600" : "text-amber-600"}`
														}>
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