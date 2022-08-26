import { createRouter } from "./context";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const defaultPostSelector = Prisma.validator<Prisma.PostSelect>()({
	id: true,
	title: true,
	body: true,
	createdAt: true,
	updatedAt: true,
});

export const postRouter = createRouter()
// create
	.mutation(
		'add', 
		{

			input: z.object({
				title: z.string().min(1).max(32),
				body: z.string().min(1),
			}),
			
			/* Creating a new post and returning it. */
			async resolve({ input }) 
			{
				const post = await prisma.post.create({
					data: input,
					select: defaultPostSelector,
				});

				return post;
			},
		})
	.query("all", {


		/* Using the Prisma Client to query the database for all posts. */
		async resolve () 
		{
			const posts = await prisma.post.findMany({
				select: defaultPostSelector,
			});

			return posts;
		},
	})

	.query(
		"byId", 
		{
			input: z.object({
				id: z.string()
			}),
			async resolve({ input }) 
			{
				const { id } = input;
			
				const post = await prisma.post.findUnique({
					where: { id },
					select: defaultPostSelector,
				});
			
				if (!post) 
				{
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `No post with id ${id}`,
					});
				}

				return post;
			}
		})

	.mutation(
		"edit", 
		{
			input: z.object({
				id: z.string(),
				data: z.object({
					body: z.string().min(1),
				}),
			}),

			async resolve ({ input })
			{
				const { id, data } = input;

				console.log(id);
				const post = await prisma.post.update({
					where: { id },
					data,
					select: defaultPostSelector,
				});

				return post;
			}
		})

	.mutation("delete", 
		{
			input: z.object({
				id: z.string(),
			}),

			async resolve ({ input }) 
			{
				const { id } = input;

				await prisma.post.delete({
					where: { id },
				});

				return { id };
			}
		
		})