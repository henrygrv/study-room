import { NextPage } from "next";
import NextError from "next/error";

import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const PostViewPage: NextPage = () =>
{
	const id = useRouter().query.id as string;
	const router = useRouter();
	const utils = trpc.useContext();
	const postQuery = trpc.useQuery(["posts.byId", { id }]);

	const deletePost = trpc.useMutation(
		["posts.delete"], 
		{
			async onSuccess()
			{
				await utils.invalidateQueries(["posts.all"]);
			}
		})
  
	if (postQuery.error) 
	{
		return (
			<NextError
				title={postQuery.error.message}
				statusCode={postQuery.error.data?.httpStatus ?? 500} 
			/>
		);
	}

	const { data } = postQuery;

	return (
		<>
			<h1>{data?.title}</h1>
			<em>Created: {data?.createdAt.toLocaleDateString('en-gb')}</em>

			<p>{data?.body}</p>

			<h2>Raw Data:</h2>
			<pre>{JSON.stringify(data, null, 4)}</pre>
			
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			<button onClick={async () => 
			{
				if (!data) 
				{
					return; 
				}

				const input = {
					id: data.id,
				}

				await deletePost.mutateAsync(input)
				
				await router.push(`/p/${data.id}/deleted?title=${data.title}`)
			}}
			>
			Delete Post
			</button>
		</>
	)
}

export default PostViewPage;