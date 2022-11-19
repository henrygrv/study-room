import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { authOptions } from "../../api/auth/[...nextauth]";
import Clock from "../../../components/clock";
import * as data from "./page.json";

import { prisma } from "../../../server/db/client";
import useGetUser from "../../../hooks/useGetUser";
import RoomLayoutProvider from "../../../components/room-layout-provider";
import { trpc } from "../../../utils/trpc";
import { Context, createContext } from "react";
import Link from "next/link";

const UserPage: NextPage = () =>
{
	const pid = useRouter().query.pid as string;
	const { user, pageUrl } = useGetUser();

	const pageQuery = trpc.useQuery(["pages.byId", { pid: pid }])

	// Mock call to get page data 
	const json = data

	if (!user)
	{
		return (<></>)
	}

	const pageNotFound: JSX.Element = (
		<>
			<div className="flex justify-center align-center h-5/6 items-center">
				<div className=" items-center justify-center">
					<h1 className="text-2xl self-center center">Page Not Found!</h1>
					<Link href={pageUrl}>Return to your page</Link>
				</div>
			</div>
		</>
	);

	if(pageQuery.error && pageQuery.error.data?.code === "INTERNAL_SERVER_ERROR") 
	{
		return pageNotFound; 
	}

	if (pageQuery.status !== 'success') 
	{
		return (
			<div className="flex justify-center align-center h-5/6 items-center">
				<div className=" items-center justify-center">
					<h1 className="text-2xl">Loading...</h1>
				</div>
			</div>
		)
	}

	const { data: pageData } = pageQuery;

	if (!pageData)
	{
		return pageNotFound;
	}

	const isUserAuthor = user?.pageId === pageData.id ? true : false

	return(
		<>
			<Head>
				<title>{user.nickname ? `${user.nickname}'s room` : `${user.name}'s room`}</title>
			</Head>
			<div className=" w-full h-5/6 my-12">
				<RoomLayoutProvider user={user} layout={json.layout} userData={json}/>
			</div>
		</>
	)
}

export type UserData = {
	schema: string;
	layout: number,
	blocks: {
		block:
		{
			id: number,
			type: string, 
			content?: string
		}
	}[]
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

	console.log(context.resolvedUrl)

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