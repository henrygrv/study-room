
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SignInComponent from "../components/SignIn";

import { trpc } from "../utils/trpc";


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


	return (
		<>
			<Head>
				<title>Study Room</title>
				<meta name="description" content="Studying Application for students and professionals alike" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<SignInComponent />
			<div>
				<h1>
          Create <span>T3</span> App
				</h1>

				<div>
					<h3>This stack uses:</h3>
					<ul>
						<li>
							<a href="https://nextjs.org" target="_blank" rel="noreferrer">
                Next.js
							</a>
						</li>
						<li>
							<a href="https://trpc.io" target="_blank" rel="noreferrer">
                tRPC
							</a>
						</li>
						<li>
							<a
								href="https://typescriptlang.org"
								target="_blank"
								rel="noreferrer"
							>
                TypeScript
							</a>
						</li>
					</ul>
				</div>
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
								console.log(input)
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
								type="idInput"
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

				<div>
					{postsQuery.data?.map(item => (
						<article key={item.id}>
							<h2>{item.title}</h2>
							<p>{item.body}</p>
							<Link href={`/p/${item.id}`}> 
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