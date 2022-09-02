import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const BasePage: NextPage  = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => 
{

	return(
		<>
		</>
	)
}


export default BasePage;



export async function getServerSideProps(context: { req: (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }) | NextApiRequest; res: ServerResponse | NextApiResponse; })
{
	const session = await unstable_getServerSession(
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