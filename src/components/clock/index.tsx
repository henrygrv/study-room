import useDateTime from "../../hooks/useTime";

const Clock = () =>
{
	const datetime = useDateTime( new Date());

	return(
		<h1 >
			{
				`${datetime.toLocaleTimeString()}` +
				`${window.matchMedia('(max-width: 768px)').matches ? "" : ` | ${datetime.toLocaleDateString()}`}`
			}
		</h1>
	)
}

export default Clock;