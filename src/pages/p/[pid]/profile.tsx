import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import useGetUser from "../../../hooks/useGetUser";
import { authOptions } from "../../api/auth/[...nextauth]";
import { prisma } from "../../../server/db/client";

const Profile: NextPage = () =>
{
	const { user } = useGetUser();
	
	if (!user)
	{
		return( <> </> )
	}

	return(
		<>
			<Head>
				<title>
					{user.nickname ? `${user.nickname}'s room | profile` : `${user.name}'s room | profile`}
				</title>	
			</Head>	
		</>
	)
}

export default Profile;


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
				if (context.resolvedUrl !== `/p/${user.pageId}/profile`) 
				{
					return {
						redirect: {
							destination: `/p/${user.pageId}/profile`
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