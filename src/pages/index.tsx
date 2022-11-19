import type { NextPage, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "./../server/db/client"

const Home: NextPage = () => 
{
	return (
		<>
			<Head>
				<title>Study Room</title>
				<meta name="description" content="Studying Application for students and professionals alike" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
		</>
	);
};

export default Home;

export async function getServerSideProps(context: { req: NextApiRequest; res:  NextApiResponse; resolvedUrl: string })
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
	else 
	{
		const userId = session?.user?.id

		if (userId) 
		{
			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (user?.pageId)
			{
				return {
					redirect: {
						destination: `/p/${user.pageId}`
					}
				}
			}
		}
	}
}