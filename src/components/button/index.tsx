import { FC, MouseEventHandler, ReactNode } from 'react'
import { useHover } from '../../hooks/useHover'

/**
 * Interface for defining the props expected by the base button component
 * 
 * Expects a MouseEventHandler event for onClick and ReactNode or just a string for its children
 */ 
interface ButtonProps<T> 
{
	onClick?: MouseEventHandler<T>
	children?: string | ReactNode
}

const Button: FC<ButtonProps<HTMLButtonElement>> = (props) => 
{
	const hover = useHover(
		{
			backgroundColor: "#dddddd" 
		}, 
		{
			backgroundColor: "#eeeeee"
		}
	);

	return(
		<>
			<button 
				onMouseEnter={hover.onMouseEnter}
				onMouseLeave={hover.onMouseLeave}
				onClick={props.onClick}
	
				style={
					{
						border: "2px solid #dddddd",
						padding: "10px",
						margin: "4px",
						borderRadius:  "5px",
						backgroundColor: hover.style.backgroundColor, 
						transition: "background-color 0.4s "
					}
				}>
				{props.children}
			</button>
		</>
	)
}

export default Button