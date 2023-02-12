import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import Head from "next/head";
import useGetUser from "../../../hooks/useGetUser";
import { authOptions, defaultPageData } from "../../api/auth/[...nextauth]";
import Image from "next/image";
import { FormEvent, useContext, useState } from "react";
import { trpc } from "../../../utils/trpc";
import useGetPageUser from "../../../hooks/useGetPageUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { DarkThemeContext } from "../../../context/themeContext";

const Profile: NextPage = () =>
{
	const router = useRouter();
	
	const pid = router.query.pid as string;
	const { user } = useGetUser();
	const { pageUser  } = useGetPageUser(pid);
	const utils = trpc.useContext();

	const [resetModalOpen, setResetModalOpen] = useState(false);
	
	const { darkTheme } = useContext(DarkThemeContext);
	const nicknameMutation = trpc.useMutation(
		["users.nick"],
		{
			async onSuccess()
			{
				await utils.invalidateQueries(["users.byId"])
			}
		}
	)
	const emailMutation = trpc.useMutation(
		["users.email"],
		{
			async onSuccess()
			{
				await utils.invalidateQueries(["users.byId"])
			}
		}
	)			

	const resetData = trpc.useMutation(
		["pages.resetPageData"],
		{
			onSuccess: async () =>
			{
				await utils.refetchQueries(["pages.getData"])
			}
		})
	
	const deleteUser = trpc.useMutation(
		["users.remove"],
		{
			onSuccess: async () =>
			{
				await router.push("../../account-deleted")
			}
		}
	)
	if (!user || !pageUser)
	{
		return( <> </> )
	}

	const checkUser = () =>
	{
		if( user.id !== pageUser.id) 
		{
			void router.push(`../${user.pageId}/profile`)
		}
	}

	checkUser()

	const handleNicknameEdit = async (event: FormEvent<HTMLFormElement>) => 
	{
		event.preventDefault()
								
		const $nickname: HTMLInputElement = (event as any).target.elements.nickname
		
		const input = {
			nickname: $nickname.value.trim(),
		}
								
		await nicknameMutation.mutateAsync(input)
	}

	const handleEmailEdit = async (event: FormEvent<HTMLFormElement>) => 
	{
		event.preventDefault()
								
		const $email: HTMLInputElement = (event as any).target.elements.email
		
		const input = {
			email: $email.value,
		}
		try				
		{
			await emailMutation.mutateAsync(input)
		}
		catch 
		{
			// 
		}
	}
	
	return(
		<>
			<Head>
				<title>
					{user.nickname ? `${user.nickname}'s room | profile` : `${user.name}'s room | profile`}
				</title>	
			</Head>	
			<div className="w-full h-screen flex items-center justify-center font-serif">
				<div className={`h-auto p-10 px-24 m-7 ${darkTheme ? "bg-slate-300": "bg-white" } drop-shadow-lg rounded-lg w-5/6 md:w-2/3 lg:w-5/12`}>
					<div className="flex items-center">
						<div className="drop-shadow-lg mr-4 border-4 border-gray-800 rounded-full relative">
							<Image 
								className="rounded-full"
								src={user.image ? user.image : ""} 
								width={100}
								height={100}
								alt={"Profile Picture"} 
							/>

						</div>
						<div>
							<div className="flex items-center">
								<h1 className="text-base md:text-2xl lg:text-4xl font-bold text-gray-800 mr-3">
									{user.name}
								
								</h1>
								<h2 className="text-gray-600 hidden md:block">
									{user.nickname && (
										"(" + user.nickname + ")"
									)}
								</h2>
							</div>

							<p className="text-gray-600 text-sm">
								{user.email && (
									user.email
								)}
							</p>

						</div>

					</div>
					<div className={"border-t-2 border-neutral-300 my-5"}/>
					<div className="">
						<span className="text-xl md:text-3xl font-bold text-gray-800 tracking-wide">Your Profile</span>

						<h3 className="pt-4 pb-2">Nickname</h3>
						<form
							// eslint-disable-next-line @typescript-eslint/no-misused-promises 
							onSubmit={handleNicknameEdit}
						>
							<input 
								type="text"
								id="nickname"
								name="nickname"
								className={`text-gray-500 hover:text-gray-700 focus:text-gray-700 border-2 border-gray-500 hover:border-gray-800 focus:border-gray-800 rounded-lg p-2 ${darkTheme ? "bg-slate-200": "bg-white" }`} 
								
								defaultValue={user.nickname ? user.nickname : "Enter your nickname"}
							/>
							<input type="submit" hidden />
						</form>

						<h3 className="pt-4 pb-2">Email</h3>
						<form
							// eslint-disable-next-line @typescript-eslint/no-misused-promises 
							onSubmit={handleEmailEdit}
						>
							<input 
								type="text"
								id="email"
								name="email"
								className={`text-gray-500 hover:text-gray-700 focus:text-gray-700 border-2 border-gray-500 hover:border-gray-800 focus:border-gray-800 invalid:border-red-700 rounded-lg p-2 ${darkTheme ? "bg-slate-200": "bg-white" }`} 
								defaultValue={user.email ? user.email : "Enter your email"}
							/>
							{emailMutation.error && (
								
								<p className="text-red-700 text-xs inline tracking-wide m-3">Invalid Email!</p>
							)}
		
							<input type="submit" hidden />
						</form>

						<h2 className="text-xl md:text-3xl font-bold text-gray-800 tracking-wide mt-5 ">Danger Zone</h2>
						
						<h3 className="pt-4 pb-2 mb-1">Sign Out</h3>

						<Link href={"../../api/auth/signout"} className={`rounded-lg p-2 text-gray-500 hover:text-red-700 border-2 border-gray-500 hover:border-gray-800 ${darkTheme ? "bg-slate-200" : "bg-white"}`}>Sign Out</Link>

						<h3 className="pt-4 pb-2 mb-1">Reset Page</h3>


						<button 
							className={`rounded-lg p-2 text-gray-500 hover:text-red-700 border-2 border-gray-500 hover:border-gray-800 ${darkTheme? "bg-slate-200": "bg-white" }`}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={()  => 
							{
								resetData.mutate({ pid })

								if (resetData.isSuccess) 
								{
									setResetModalOpen(true)
								}
								setTimeout(() => 
								{
									setResetModalOpen(false)
								}, 4000);
							}
							}
						> Reset Page</button>

						<h3 className="pt-4 pb-2 mb-1" > Delete Account! </h3>

						<button 
							className={`rounded-lg p-2 text-gray-500 hover:text-red-700 border-2 border-gray-500 hover:border-gray-800 ${darkTheme? "bg-slate-200": "bg-white" }`}
							onClick={() => deleteUser.mutate({ id: user.id })}
						>
							Delete Account
						</button>
					</div>
				</div>
			</div>
			{resetModalOpen && (
				
				<div className="fixed right-[2.5%] bottom-[5%] bg-white p-5 rounded-xl drop-shadow-lg  " >
					Page Reset !
				</div>
			)}
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
	else
	{
		return {
			props: {

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
	// 			if (context.resolvedUrl !== `/p/${user.pageId}/profile`) 
	// 			{
	// 				return {
	// 					redirect: {
	// 						destination: `/p/${user.pageId}/profile`
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
	// }
}