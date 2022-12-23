import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import useGetUser from "../../../hooks/useGetUser";
import { authOptions } from "../../api/auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";

/**
 * 
 * NOTE: This route will always redirect to the currently authenticated user's page
 * even if accessed on a different pid
 */
const SettingsPage: NextPage = () => 
{
	const pid = useRouter().query.pid as string;
	const { user } = useGetUser();
	
	const { data: pagePrefsData } = trpc.useQuery(
		["pages.byId", { pid: pid }]
	) 
	if (!user || !pagePrefsData)
	{
		return ( <> </> )
	}
	const isUserAuthor = user?.pageId === pagePrefsData.id ? true : false

	return(
		<>
			<Head>
				<title>
					{user.nickname ? `${user.nickname}'s room | settings` : `${user.name}'s room | settings`}
				</title>	
			</Head>	

			{!isUserAuthor && (
				<>Go away</>
			)}
		</>
	)
}

export default SettingsPage;


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
	if(session) 
	{
		
		const userId = session.user?.id

		if (userId) 
		{
			const user = await prisma.user.findUnique({
				where: { id: userId }
			})

			if (user)
			{
				if (context.resolvedUrl !== `/p/${user.pageId}/settings`) 
				{
					return {
						redirect: {
							destination: `/p/${user.pageId}/settings`
						}
					}
				}
				else
				{
					return {
						props: {}
					}
				}
			}
		}
	}
}