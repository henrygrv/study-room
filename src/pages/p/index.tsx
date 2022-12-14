import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import { prisma } from "./../../server/db/client"

const BasePage: NextPage  = () => 
{

	return(
		<>
		</>
	)
}


export default BasePage;



export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }) | NextApiRequest; res: ServerResponse | NextApiResponse; })
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
			})
		
			if (user)
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