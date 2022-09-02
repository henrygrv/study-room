import { ServerResponse, IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse, NextPage, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import AuthButton from "../../../components/derived/auth-button";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

const UserPage: NextPage = () => 
{
	const { data: session }  = useSession(); 
	const pid = useRouter().query.id as string;
	const utils = trpc.useContext();

	const pageQuery = trpc.useQuery(["pages.byId", { id: pid }])
	
	const nickUpdateMutator = trpc.useMutation(
		["users.nick"],
		{
			async onSuccess() 
			{
				await utils.invalidateQueries(["users.byId"])
			}
		}
	)
	
	let uid;
	if (session && session.user) 
	{
		uid = session.user.id
	}
	const userQuery = trpc.useQuery(["users.byId", { id: uid }])

	const user = userQuery.data

	if (!user) 
	{
		return <></>
	}

	return(
		<>
			<Head>
				<title>{user.nickname ? `${user.nickname}'s room` : `${user.name}'s room`}</title>
			</Head>
			{user.image ? 
				<a href={user.image}> 
					<Image src={user.image} width={100} height={100}/> 
				</a> : <></>}
			<h1>{pid}</h1>
			<h2>{pageQuery?.data?.body?.toString()}</h2>
			{`Name: ${user.name}`}
			<br />
			{`Nickname: ${user.nickname}`}
			<br />
			{`imagesrc: ${user.image}`}
			<br />
			<AuthButton />

			< form 
			
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onSubmit={
					async (e) => 
					{
						e.preventDefault();
						const $nickname: HTMLInputElement = (e as any).target.elements.nickname;
						
						console.log($nickname.value)
						const input = {
							id: user.id,
							nickname: $nickname.value
						};

						await nickUpdateMutator.mutateAsync(input);
						$nickname.value = "";
					}
				}>
				<input
					id="nickname"
					name="nickname"
					type="text">
						
				</input>
				<input type="submit" disabled={nickUpdateMutator.isLoading}/>
				{nickUpdateMutator.error && (
					<p style={{ color: 'red' }}>{nickUpdateMutator.error.message}</p>
				)}
			</form>

		</>
	)
}

export default UserPage;


export async function getServerSideProps(context: {res: ServerResponse | NextApiResponse<any>; req: NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }); resolvedUrl: string;}) 
{
	const session = await unstable_getServerSession(
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
				if (context.resolvedUrl !== `/p/${user.pageId}`) 
				{
					return {
						redirect: {
							destination: `/p/${user.pageId}`
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
			}
		}
	}
}