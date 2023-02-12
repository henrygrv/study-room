import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";


const AccountDeletedPage: NextPage = () => 
{
	return (
		<>
			<Head>
				<title>Account Deleted</title>
			</Head>
			<div className="flex h-screen justify-center align-center  items-center">
				<div className="flex flex-col items-center rows-3 justify-center flex-wrap">
					<h1 className="text-xl self-center center">:(</h1>
					<h1 className="text-2xl self-center center">Account Deleted!</h1>
					<Link href={"./api/auth/signin"}>
						<p className={"transition ease-in-out duration-300 hover:scale-110 transform-gpu cursor-pointer"}>Sign Up</p>
					</Link>
				</div>
			</div>
		</>
	)
}

export default AccountDeletedPage;

