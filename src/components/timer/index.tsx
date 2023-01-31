
import { FC, useEffect, useMemo, useState } from "react";

import Button from "../button";
import { PageData } from "../../pages/p/[pid]";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// interface TimerProps {
// 	pageData?: PageData;
// 	id: number;
// }

// const Timer: FC<TimerProps> = (props) => 
// {
// 	if (!props.pageData) 
// 	{
// 		return;
// 	}

// 	const { blocks } = props.pageData;

// 	const blockData = blocks[props.id]
// 	const [time, setTime] = useState( props.deadline - Date.now());

// 	const times = [
// 		{ time: 60*MINUTE, string: "60m" }, 
// 		{ time: 45*MINUTE, string: "45m" },
// 		{ time: 30*MINUTE, string: "30m" },
// 		{ time: 15*MINUTE, string: "15m" },
// 		{ time: 10*MINUTE, string: "10m" },
// 		{ time: 5*MINUTE, string: "5m" },
// 	]

// 	useEffect(() => 
// 	{
// 		const interval = setInterval(
// 			() => setTime(props.deadline - Date.now()),
// 			1000,
// 		);

// 		return () => clearInterval(interval);
// 	}, [props.deadline]);

// 	return (
// 		<div className="grid grid-rows-1 grid-cols-2 w-full h-full">
// 			<div className="w-full h-full">
// 				<div className="px-4 py-16 w-full h-full ">
// 					<div className="w-full h-full rounded-xl bg-white border-2 border-gray-800 drop-shadow-md">
// 						<div className="grid grid-cols-3 grid-rows-2 w-full h-full p-4">
// 							{times.map(time => (
// 								<Button 
// 									key={time.time} 
// 									timelength={time.time} 
// 									displayValue={time.string} 
// 									updateTimer={(value) => setTime(value)}
// 								/>
// 							))}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="w-full h-full">
// 				{Object.entries({
// 					Days: time / DAY,
// 					Hours: (time / HOUR) % 24,
// 					Minutes: (time / MINUTE) % 60,
// 					Seconds: (time / SECOND) % 60,
// 				}).map(([label, value]) => (
// 					<div key={label} className="col-4">
// 						<div className="box">
// 							<p>{`${Math.floor(value)}`.padStart(2, "0")}</p>
// 							<span className="text">{label}</span>
// 						</div>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

interface TimerProps {
	blockData: {
		id: number,
		type: string,
		content?: string | number

	}
}

const Timer: FC<TimerProps> = (props) => 
{
	return(
		<>
			Timer
			<pre>
				{JSON.stringify(props.blockData)}
			</pre>
		</>
	)
}
export default Timer;