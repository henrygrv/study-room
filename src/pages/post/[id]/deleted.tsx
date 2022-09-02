import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const DeletedPage: NextPage = () => 
{
	const router = useRouter();

	return(
		<>
			<div style={
				{ 
					height: "100vh", 
					display: 'flex', 
					justifyContent: 'center', 
					alignItems: 'center',
					flexDirection: 'column',
				}
			}>
				<div style={
					{
						margin: "5px",
						padding: "10px",
						border: "3px #111111 solid",
						borderRadius: "20px",
						boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);"
					}
				}>
					<h1>
						Deleted post! 
					</h1>
					<h2>
						Id:{router.query.id}
					</h2>
					<h2>
						title: {router.query.title}
					</h2>
					<br />
				</div>
				<div style={
					{
						margin: "5px",
					}
				}>
					<Link href="/" style={
						{
							textDecoration: "underline",
						}
					}>
						Go home
					</Link>
				</div>


					
			</div>
		</>
	)
}

export default DeletedPage;