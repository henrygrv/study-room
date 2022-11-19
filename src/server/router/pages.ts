import { z } from "zod";
import { createRouter } from "./context";

import { prisma } from "./../db/client"
import { TRPCError } from "@trpc/server";

export const pageRouter = createRouter()
	.mutation("add", {

		input: z.object({
			body: z.string(),
		}),
		
		async resolve( { ctx })
		{

			if (!ctx.session?.user) 
			{
				return
			}

			const page = await prisma.page.create({
				data: {
					user: {
						connect: {
							id: ctx.session.user.id
						}
					},
				}
			})

			return page;
	
		}
	})

// .query(
// 	"currentUser", 
// 	{

// 		async resolve ( input )
// 		{
// 			const { ctx } = input;
				
// 			if (!ctx.session?.user)
// 			{
// 				return
// 			}

// 			// if (!page)
// 			// {
// 			// 	throw new TRPCError({
// 			// 		code: "NOT_FOUND",
// 			// 		"message": `No page with id`,
// 			// 	})
// 			// }
// 		}
// 	})

	.query(
		"byId",
		{
			input: z.object({
				pid: z.string().optional()
			}),

			async resolve ({ input })
			{
				const { pid } = input

				const page = await prisma.page.findUnique({
					where: {
						id: pid	
					}
				})

				return page;
			}


		}
	)
	.mutation(
		"updateData",
		{
			input: z.object({
				id: z.string(),
				data: z.object({
					layout: z.number(),
					blocks: z.array(z.object({
						block:z.object({
							type: z.string(),
							content: z.string()
						})
					}))
				})
			}),

			async resolve({ input })
			{
				const { id, data } = input;

				const updateData = await prisma.page.update({
					where: { id },
					data: {
						pageData: { data }
					}
					
				})
			}


		}
	)
