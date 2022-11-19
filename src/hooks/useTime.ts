import { useEffect, useState } from "react";

export default function useDateTime(date: Date)
{
	// track time and provide a function to update the time
	const [time, setTime] = useState<Date>(new Date());

	const UPDATE_INTERVAL = 500;

	useEffect(() =>
	{	
		// Update time every period as set in UPDATE_INTERVAL
		const time = setTimeout(() => 
		{
			setTime(date)
		}, UPDATE_INTERVAL)
			
		return () => 
		{
			clearTimeout(time)
		}
	}, [time, date])

	// Return new time
	return time;
}