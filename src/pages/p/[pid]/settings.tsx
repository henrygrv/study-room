import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import useGetUser from "../../../hooks/useGetUser";
import { authOptions } from "../../api/auth/[...nextauth]";
import { prisma } from "../../../server/db/client";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { Layout } from "../../../components/room-layout-provider";

/**
 * 
 * NOTE: This route will always redirect to the currently authenticated user's page
 * even if accessed on a different pid
 */
const SettingsPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => 
{
	const pid = useRouter().query.pid as string;
	const { user } = useGetUser();
	
	const { data: pageData } = trpc.useQuery(
		["pages.getData", { pid }]
	);

	const { data: page } = trpc.useQuery(
		["pages.byId", { pid }]
	);
	if (!user || !pageData || !page)
	{
		return ( <> </> )
	}


	return(
		<>
			<Head>
				<title>
					{user.nickname ? `${user.nickname}'s room | settings` : `${user.name}'s room | settings`}
				</title>	
			</Head>	

			<div className="w-full h-screen flex items-center justify-center font-serif">
				<div className="h-auto p-10 px-24 m-7 bg-white drop-shadow-lg rounded-lg w-5/6 md:w-2/3 lg:w-5/12">
					<div className="flex flex-col">
						<h1 className="text-base md:text-2xl lg:text-4xl mb-3" >Page Details</h1>
						<h3>{`Date Created: ${page.createdAt.toLocaleString()}`}</h3>
						<h3>{`Last Updated: ${page.updatedAt.toLocaleString()}`}</h3>
						<h3>{`Number of Blocks: ${pageData.blocks.filter(block => (block.block.type !== "empty")).length}`}</h3>
						<h3>{`Layout: ${Layout[pageData.layout]}`}</h3>
					</div>
					<div className={"border-t-2 border-neutral-300 my-5"}/>

					<div>
						<div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">

							<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
								<div>
									<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">

										{/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + ((pageData.layout === 0) ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
											onClick={}
										> Base Layout </button>
										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + ((pageData.layout === 1) ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
										> Side-By-Side </button>
										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + ((pageData.layout === 2) ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
										> Large-on-Top</button>
									</nav>
								</div>
							</div>
						</div>	
					</div>
				</div>
			</div>	

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