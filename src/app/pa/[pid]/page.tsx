export default function PidPage({ params }: { params: { pid: number } }) 
{
	return (
		<div>
			{params.pid}
		</div>
	)
}
