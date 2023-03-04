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
import { useContext } from "react";
import { DarkThemeContext } from "../../../context/themeContext";


/**
 * 
 * NOTE: This route will always redirect to the currently authenticated user's page
 * even if accessed on a different pid
 */
const SettingsPage: NextPage = () => 
{
	const router = useRouter();
	const pid = router.query.pid as string;
	const { user } = useGetUser();
	const utils = trpc.useContext()

	const { darkTheme, setDarkTheme } = useContext(DarkThemeContext);
	
	const { data: pageData } = trpc.useQuery(
		["pages.getData", { pid }]
	);

	const { data: page } = trpc.useQuery(
		["pages.byId", { pid }]
	);

	const updateData = trpc.useMutation(
		["pages.updateData"],
		{
			onSuccess: async () =>
			{
				await utils.refetchQueries(["pages.getData"])
			}
		})
		
	if (!user || !pageData || !page)
	{
		return ( <> </> )
	}

	const updateLayoutHandler = (layoutValue: Layout) =>
	{
		const { schema, blocks, userPreferences } = pageData;
		const input = {
			pid,
			data: {
				schema,
				layout: layoutValue,
				blocks,
				userPreferences
			},
		}

		void updateData.mutateAsync(input);
	}

	const updateThemeHandler = (state: boolean)=> 
	{
		const { schema, blocks, layout } = pageData;
		const input = {
			pid,
			data: {
				schema,
				layout,
				blocks,
				userPreferences: {
					darkTheme: state
				} 
			} 
		}
		
		setDarkTheme(state);
		void updateData.mutateAsync(input);
	}

	return(
		<>
			<Head>
				<title>
					{user.nickname ? `${user.nickname}'s room | settings` : `${user.name}'s room | settings`}
				</title>	
			</Head>	

			<div className="w-full h-screen flex items-center justify-center font-serif">
				<div className={`h-auto p-10 px-24 m-7 ${darkTheme ? "bg-slate-300" : "bg-white" } drop-shadow-lg rounded-lg w-5/6 md:w-2/3 lg:w-5/12`}>
					<div className="flex flex-col">
						<h1 className="text-base md:text-2xl lg:text-4xl mb-3" >Page Details</h1>
						<h3>{`Date Created: ${page.createdAt.toLocaleString()}`}</h3>
						<h3>{`Last Updated: ${page.updatedAt.toLocaleString()}`}</h3>
						<h3>{`Number of Blocks: ${pageData.blocks.filter(block => (block.block.type !== "empty")).length}`}</h3>
						<h3>{`Layout: ${Layout[pageData.layout]}`}</h3>
						<h3>{`Theme: ${pageData.userPreferences.darkTheme ? "Dark" : "Light"}`}</h3>
					</div>
					<div className={"border-t-2 border-neutral-300 my-5"}/>

					<div>
						<h2>Layout</h2>
						<div className="flex items-center justify-between py-3">

							<div className=" sm:flex sm:flex-1 sm:items-center sm:justify-between">
								<div>
									<nav className={`isolate inline-flex -space-x-px rounded-md shadow-sm ${darkTheme ? "bg-slate-200" : "bg-white"}`}>

										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + ((pageData.layout === 0) ? `${darkTheme ? "bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-200 z-50" : "bg-amber-900 border-amber-500 text-amber-600 hover:bg-amber-100 z-50"}` : " z-20 bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
											onClick={() => updateLayoutHandler(Layout.Base)}
										> Base Layout </button>
										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + ((pageData.layout === 1) ? `${darkTheme ? "bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-200 z-50" : "bg-amber-900 border-amber-500 text-amber-600 hover:bg-amber-100 z-50"}` : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
											onClick={() => updateLayoutHandler(Layout.SideBySide)}
										> Side-By-Side </button>
										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + ((pageData.layout === 2) ? `${darkTheme ? "bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-200 z-50" : "bg-amber-900 border-amber-500 text-amber-600 hover:bg-amber-100 z-50"}` : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
											onClick={() => updateLayoutHandler(Layout.LargeOnTop)}
										> Large-on-Top</button>
									</nav>
								</div>
							</div>
						</div>	

						<h2>Theme</h2>
						<div className="flex items-center justify-between py-3">

							<div className=" sm:flex sm:flex-1 sm:items-center sm:justify-between">
								<div>
									<nav className={`isolate inline-flex -space-x-px rounded-md shadow-sm ${darkTheme ? "bg-slate-200" : "bg-white"}`}>

										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + (pageData.userPreferences.darkTheme ? `${darkTheme ? "bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-200 z-50" : "bg-amber-900 border-amber-500 text-amber-600 hover:bg-amber-100 z-50"}` : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
											onClick={() => updateThemeHandler(true)}
										> Dark </button>
										<button
											className={"relative z-10 inline-flex items-center border  px-4 py-2 text-sm font-medium focus:z-20" + (!pageData.userPreferences.darkTheme ? `${darkTheme ? "bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-200 z-50" : "bg-amber-900 border-amber-500 text-amber-600 hover:bg-amber-100 z-50"}` : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50")}
											onClick={() => updateThemeHandler(false)}
										> Light </button>

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