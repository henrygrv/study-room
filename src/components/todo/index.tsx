import { FC, useContext, useState } from "react";
import { PageData } from "../../pages/p/[pid]";
import { DarkThemeContext } from "../../context/themeContext";
import { AuthorContext } from "../../context/authorContext";

interface  TodoListProps {
	pageData: PageData;
	blockData: {
		id: number,
		type: string,
		content?: string | number

	}
}

const TodoList: FC<TodoListProps> = (props) =>
{
	const [items, setItems] = useState([{ id: 0, content: "Todo" }]);

	const { darkTheme } = useContext(DarkThemeContext)
	const isUserAuthor = useContext(AuthorContext)

	const add = (item: { id: number, content: string}) => setItems([...items, item]);
	return(
		<>
			<div className={`mx-32 my-10 px-40 flex flex-col w-full h-max lg:h-full rounded-xl ${darkTheme ? "bg-slate-200" : "bg-white"} border-2 border-gray-800 drop-shadow-md items-center justify-center`}>
				<ul className="w-full opacity-100">
					{items.map(item => (
						<li key={item.id}>
							<div className={`${darkTheme ? "bg-slate-200" : "bg-white"} border rounded-lg grid grid-cols-7 my-1`}>
								<input type="checkbox" className="mr-3 inline m-2" />
								<h1 
									contentEditable={isUserAuthor}
									suppressContentEditableWarning
									className="inline col-span-6 p-2"
								>
									<h1 className="float-left" spellCheck={false}>{item.content}</h1>
									<button className="float-right" onClick={() => setItems(items.filter(element => element.id !== item.id))}>x</button>
								
								</h1>
							
							</div>
						</li>
					))}
				</ul>
				<button 
					className={`${darkTheme? "bg-slate-200" : "bg-white"} mt-5`}
			
					onClick={() => add({ id: (items.length ? items.at(-1).id : -1)+ 1, content: "Todo" })}>Add Item</button>

			</div>

		</>
	)
}

export default TodoList;