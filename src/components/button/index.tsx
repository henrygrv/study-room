import { Dispatch, FC, SetStateAction } from "react";

interface ButtonProps {
	timelength: number;
	updateTimer: (value: number) => void;
	displayValue: string;

}
const Button: FC<ButtonProps> = (props) => 
{
	return(
		<>
			<button 
				className="m-2 rounded-xl border-2 border-gray-800 bg-gray-200 opacity-75 hover:opacity-90"
				onClick={() => props.updateTimer((Date.now() + props.timelength))}
			>
				{props.displayValue}	
				{}
			</button>
		</>
	)
}

export default Button