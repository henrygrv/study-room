import { FC } from "react";

interface  TodoListProps {
	blockData: {
		id: number,
		type: string,
		content?: string | number

	}
}

const TodoList: FC<TodoListProps> = (props) =>
{
	return(
		<>
			<h1>Todo</h1>
			<pre>
				{JSON.stringify(props.blockData)}
			</pre>
		</>
	)
}

export default TodoList;