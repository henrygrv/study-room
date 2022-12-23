// External Packages
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { SyncLoader } from "react-spinners"
import Link from "next/link";

// External Types
import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";

// Internal imports
import { authOptions } from "../../api/auth/[...nextauth]";
import useGetUser from "../../../hooks/useGetUser";
import RoomLayoutProvider from "../../../components/room-layout-provider";
import { trpc } from "../../../utils/trpc";
import useGetPageUser from "../../../hooks/useGetPageUser";
import { AuthorContext } from "../../../context/authorContext";

// Typesafe wrapper around the user data stored in each page
export interface UserData {
	schema: string;
	layout: number;
	blocks: {
		block:
		{
			id: number,
			type: string, 
			content?: string
		}
	}[],
}

const UserPage: NextPage = () =>
{
	const pid = useRouter().query.pid as string;
	const utils = trpc.useContext();
	const { pageUser, pageUrl } = useGetPageUser(pid);
	const { user: authedUser } = useGetUser();


	const pageQuery = trpc.useQuery(
		["pages.byId", { pid: pid }],
		{
			onError: () => 
			{
				return pageNotFound;
			}
		})
	
	const pageDataQuery = trpc.useQuery(
		["pages.getData", { pid: pid }],
		{
			refetchInterval: 4000
		}
	
	) 
	const updatePageData = trpc.useMutation(
		["pages.updateData"],
		{
			onSuccess: async() => 
			{
				await utils.invalidateQueries(["pages.getData"]);
			},
		}
	);

	const pageNotFound: JSX.Element = (
		<>
			<div className="flex justify-center align-center h-5/6 items-center">
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
	);

	const loading: JSX.Element = (
		<>
			<div className="flex justify-center align-center h-5/6 items-center">
				<div className=" items-center justify-center">
					<SyncLoader color="#1f2937" speedMultiplier={0.75}/>
				</div>
			</div>
		</>
	)
	
	if(pageQuery.error && pageQuery.error.data?.code === "INTERNAL_SERVER_ERROR") 
	{
		return pageNotFound; 
	}

	if (pageQuery.status !== 'success') 
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
		return pageNotFound;
	}
	const isUserAuthor = authedUser?.pageId === pageData.id ? true : false

	if(pageDataQuery.isLoading) 
	{
		return loading;
	}
	const prefData = pageDataQuery.data
	
	if(!prefData)
	{
		return loading;
	}
	return(
		<>
			<Head>
				<title>{pageUser.nickname ? `${pageUser.nickname}'s room` : `${pageUser.name}'s room`}</title>
			</Head>
			<div className=" w-full h-5/6 my-12 ">
				<AuthorContext.Provider value={isUserAuthor}>
					<RoomLayoutProvider user={pageUser} layout={prefData.layout} userData={prefData}/>
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
	// if(session) 
	// {
		
	// 	const userId = session.user?.id

	// 	if (userId) 
	// 	{
	// 		const user = await prisma.user.findUnique({
	// 			where: { id: userId }
	// 		})

	// 		if (user)
	// 		{
	// 			if (context.resolvedUrl !== `/p/${user.pageId}`) 
	// 			{
	// 				return {
	// 					redirect: {
	// 						destination: `/p/${user.pageId}`
	// 					}
	// 				}
	// 			}
	// 			else
	// 			{
	// 				return {
	// 					props: {}
	// 				}
	// 			}
	// 		}
	// 	}
	return {
		props:{
			
		}
	}
}