import type { NextPage, NextApiRequest, NextApiResponse, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import AuthButton from "../components/derived/auth-button";


import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "./../server/db/client"
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

const Home: NextPage = () => 
{
	const utils = trpc.useContext();
	const postsQuery = trpc.useQuery(["posts.all"])

	const addPost = trpc.useMutation("posts.add", {
		async onSuccess()
		{
			await utils.invalidateQueries(["posts.all"]);
		}
	});

	const editPost = trpc.useMutation(["posts.edit"], {
		async onSuccess()
		{
			await utils.invalidateQueries(["posts.all"]);
		}
	});

	// Auto Animation ref
	const parent = useRef<HTMLDivElement>(null)

	useEffect(() => 
	{
		parent.current && autoAnimate(parent.current)
	}, [parent])

	return (
		<>
			<Head>
				<title>Study Room</title>
				<meta name="description" content="Studying Application for students and professionals alike" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<AuthButton />
			
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			{/* <Button onClick={async (e) =
			{

				e.preventDefault();

			}}/>  */}
			<div>
				<div style={
					{
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}
				}>
					<div style={
						{ 
							display: "grid", 
							gridTemplateColumns: "3fr 3fr", 
							width: "50%"  
						}
					}>
						<form
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onSubmit={async (e) => 
							{
								e.preventDefault();
								const $text: HTMLInputElement = (e as any).target.elements.text;
								const $title: HTMLInputElement = (e as any).target.elements.title;
								const input = {
									title: $title.value,
									body: $text.value,
								};
								try 
								{
									await addPost.mutateAsync(input);

									$title.value = '';
									$text.value = '';
								}
								catch 
								// eslint-disable-next-line no-empty
								{ }
							}}
						>
							<h2>Create Post:</h2>
							<label htmlFor="title">Title:</label>
							<br />
							<input
								id="title"
								name="title"
								type="text"
								disabled={addPost.isLoading}
							/>

							<br />
							<label htmlFor="text">Text:</label>
							<br />
							<textarea id="text" name="text" disabled={addPost.isLoading} />
							<br />
							<input type="submit" disabled={addPost.isLoading} />
							{addPost.error && (
								<p style={{ color: 'red' }}>{addPost.error.message}</p>
							)}
						</form>

						<form 
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onSubmit={async (e) => 
							{
								e.preventDefault();
								const $id: HTMLInputElement = (e as any).target.elements.idInput;
								const $text: HTMLInputElement = (e as any).target.elements.text;

								const input = {
									id: $id.value,
									data: { body: $text.value },
								};
								try 
								{
									await editPost.mutateAsync(input);
									$id.value = '';
									$text.value = '';
								}
								catch 
								// eslint-disable-next-line no-empty
								{ }
							}}
						>
							<h2>Edit:</h2>
							<label htmlFor="idInput">Id:</label>
							<br />
							<input
								id="idInput"
								name="idInput"
								type="text"
								disabled={editPost.isLoading}
							/>

							<br />
							<label htmlFor="text">Text:</label>
							<br />
							<textarea id="text" name="text" disabled={editPost.isLoading} />
							<br />
							<input type="submit" disabled={editPost.isLoading} />
							{editPost.error && (
								<p style={{ color: 'red' }}>{editPost.error.message}</p>
							)}
						</form>
					</div>
				</div>
				
				<div ref={parent}>
					{postsQuery.data?.map(item => (
						<article key={item.id}>
							<h2>{item.title}</h2>
							<p>{item.body}</p>
							<Link href={`/post/${item.id}`}> 
									View Details
							</Link>
							{ /* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
							<h4 onClick={() => navigator.clipboard.writeText(item.id)}>{item.id}</h4>
						</article>
					))}
				</div>
			</div>

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