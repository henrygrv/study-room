import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

const PageNotFound = () => 
{
	const pageUrl = useRouter().query.pageUrl as string;

	return(
		<>
			<Head>
				<title>Page Not Found!</title>
			</Head>
			<div className="flex h-screen justify-center align-center  items-center">
				<div className="flex flex-col items-center rows-3 justify-center flex-wrap">
					<h1 className="text-xl self-center center">:(</h1>
					<h1 className="text-2xl self-center center">Page Not Found!</h1>
					<Link 
						href={pageUrl ? pageUrl : "../../p"}
						className={"pt-5 self-center center "}>
						<p className={"transition ease-in-out duration-300 hover:scale-110 transform-gpu cursor-pointer"}>Return to your page</p>
					</Link>
				</div>
			</div>
		</>

	)
};

export default PageNotFound;