
import { FC, useContext, useEffect, useState } from "react";

import TimerButton from "../button";
import { DarkThemeContext } from "../../context/themeContext";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { PageData } from "../../pages/p/[pid]";

const SECOND = 1000;
const MINUTE = SECOND * 60;

interface TimerProps {
	blockData: {
		id: number,
		type: string,
		content?: string | number
		duration: number
	};
	pageData: PageData;
}

const Timer: FC<TimerProps> = (props) => 
{
	const pid = useRouter().query.pid as string;
	const [timeLeft, setTimeLeft] = useState<number>(props.blockData.duration);
	const [paused, setPaused] = useState<boolean>(true);

	const { darkTheme } = useContext(DarkThemeContext);
	
	const times = [
		{ time: 60*MINUTE, string: "60m" }, 
		{ time: 45*MINUTE, string: "45m" },
		{ time: 30*MINUTE, string: "30m" },
		{ time: 15*MINUTE, string: "15m" },
		{ time: 10*MINUTE, string: "10m" },
		{ time: 5*MINUTE, string: "5m" },
	]

	useEffect(() => 
	{
		const interval = setInterval(() => 
		{
			if (paused === false && timeLeft > 0)
			{
				setTimeLeft(timeLeft - 1000);
			}
		},1000);

		return () => clearInterval(interval);
	}, [timeLeft, paused]);

	const updateTimer = trpc.useMutation(["pages.updateData"])

	return (
		<>
			<div className="grid grid-rows-1 grid-cols-2 w-full h-full">
				<div className="w-full h-full">
					<div className="px-4 py-16 w-full h-full ">
						<div className={`w-full h-max lg:h-full rounded-xl ${darkTheme ? "bg-slate-200" : "bg-white"}  border-2 border-gray-800 drop-shadow-md`}>
							<div className="grid grid-cols-3 grid-rows-2 w-full h-full p-4">
								{times.map(time => (
									<TimerButton 
										key={time.time} 
										duration={time.time} 
										displayValue={time.string} 
										updateTimer={(value) => 
										{
											setTimeLeft(value);
											setPaused(false);
											
											props.blockData.duration = value;
											props.pageData.blocks[props.blockData.id]!.block.duration = value

											const input = {
												pid,
												data: props.pageData
											}
											void updateTimer.mutateAsync(input);
										}}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="w-full h-full">
					<div className="px-4 py-16 w-full h-full ">
						<div className={`w-full h-full rounded-xl ${darkTheme ? "bg-slate-200" : "bg-white"} border-2 border-gray-800 drop-shadow-md flex items-center justify-center`}>
							<div className="grid grid-rows-3 h-full">
								<div className="  md:text-3xl  lg:text-4xl  xl:text-5xl 2xl:text-7xl font-serif row-span-2 flex items-center">

									{new Date(timeLeft).toISOString().slice(11, 19)}
								</div>
								<div className="flex justify-center items-center">
									<button className={"bg-slate-100 px-4 py-3 drop-shadow-lg rounded-lg border border-gray-800 opacity-75 hover:opacity-90"} onClick={() => paused ? setPaused(false) : setPaused(true)} >
										{paused? "Resume" : "Pause"}
									</button>
								</div>

							</div>


						</div>
					</div>
				</div>
			</div>
		</>
	);
};


export default Timer;