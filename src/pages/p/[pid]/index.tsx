// External Packages
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { SyncLoader } from "react-spinners"
import Link from "next/link";

// External Types
import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";

// Internal imports
import { authOptions } from "../../api/auth/[...nextauth]";
import useGetUser from "../../../hooks/useGetUser";
import RoomLayoutProvider from "../../../components/room-layout-provider";
import { trpc } from "../../../utils/trpc";
import useGetPageUser from "../../../hooks/useGetPageUser";
import { AuthorContext } from "../../../context/authorContext";

// Typesafe wrapper around the user data stored in each page
export interface PageData {
	schema: string;
	layout: number;
	blocks: {
		block:
		{
			id: number,
			type: string, 
			content?: string | number
		}
	}[],
	// eslint-disable-next-line @typescript-eslint/ban-types
	userPreferences: {
		
	}
}

const UserPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement =>
{
	const router = useRouter();
	const pid = router.query.pid as string;
	const { pageUser, pageUrl } = useGetPageUser(pid);

	const { user: authedUser } = useGetUser();


	const pageQuery = trpc.useQuery(
		["pages.byId", { pid }],
		{
			onError: () => 
			{
				console.log(authedUser?.pageId)
				void router.push({
					pathname: "../../p/page-not-found",
					query: { pageUrl: authedUser?.pageId }
				}, "../../p/page-not-found");
			},
			retry: 2,
			// Retry every 8 seconds
			retryDelay: 8000,
		})
	
	const pageDataQuery = trpc.useQuery(
		["pages.getData", { pid }],
		{
			// Refresh data every 2 seconds
			refetchInterval: 2000
		}
	
	) 

	// const pageNotFound: JSX.Element = (
	// 	<>
	// 		<div className="flex h-screen justify-center align-center  items-center">
	// 			<div className="flex flex-col items-center rows-3 justify-center flex-wrap">
	// 				<h1 className="text-xl self-center center">:(</h1>
	// 				<h1 className="text-2xl self-center center">Page Not Found!</h1>
	// 				<Link 
	// 					href={pageUrl ? pageUrl : "../../p"}
	// 					className={"pt-5 self-center center "}>
	// 					<p className={"transition ease-in-out duration-300 hover:scale-110 transform-gpu cursor-pointer"}>Return to your page</p>
	// 				</Link>
	// 			</div>
	// 		</div>
	// 	</>
	// );

	const loading: JSX.Element = (
		<>
			<div className="flex h-screen justify-center align-center items-center">
				<div className=" items-center justify-center">
					<SyncLoader color="#1f2937" speedMultiplier={0.75}/>
				</div>
			</div>
		</>
	)
	
	if(pageQuery.error) 
	{
		void router.push({
			pathname: "../../p/page-not-found",
			query: { pageUrl: authedUser?.pageId }
		}, "../../p/page-not-found")
	}

	if (pageQuery.isLoading) 
	{
		return loading;
	}

	if (!pageUser)
	{
		return (<></>)
	}

	const { data: pageData } = pageQuery;

	if (!pageData)
	{
		void router.push({
			pathname: "../../p/page-not-found",
			query: { pageUrl: authedUser?.pageId }
		}, "../../p/page-not-found")

		return (<></>);
	}
	

	const { data: prefData } = pageDataQuery;
	
	if(!prefData)
	{
		void router.push({
			pathname: "../../p/page-not-found",
			query: { pageUrl: authedUser?.pageId }
		}, "../../p/page-not-found")
		return (<></>)
	}
	

	const isUserAuthor = authedUser?.pageId === pageData.id ? true : false;

	return(
		<>
			<Head>
				<title>{pageUser.nickname ? `${pageUser.nickname}'s room` : `${pageUser.name}'s room`}</title>
			</Head>
			<div>
				
				<AuthorContext.Provider value={isUserAuthor}>
					<RoomLayoutProvider user={pageUser} layout={prefData.layout} pageData={prefData}/>
				</AuthorContext.Provider>
			</div>
		</>
	)
}


export default UserPage; 

export async function getServerSideProps(
	context: {
		res: ServerResponse | NextApiResponse; 
		req: NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }); 
		resolvedUrl: string;
	}
) 
{
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	)

	if (!session) 
	{
		return {
			redirect:{
				destination: "/api/auth/signin"
			}
		}
	}
	return {
		props:{
			
		}
	}
}