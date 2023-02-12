import { Dispatch, FC, SetStateAction } from "react";

interface ButtonProps {
	duration: number;
	updateTimer: (value: number) => void;
	displayValue: string;

}
const TimerButton: FC<ButtonProps> = (props) => 
{
	return(
		<>
			<button 
				className={`m-2 sd:m-2 rounded-xl  drop-shadow-lg border-2 border-gray-800 bg-gray-200 opacity-75 hover:opacity-90`}
				onClick={() => props.updateTimer(props.duration)}
			>
				{props.displayValue}	
			</button>
		</>
	)
}

export default TimerButton;

