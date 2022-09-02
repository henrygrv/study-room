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
			console.log("hello")

			if (!ctx.session?.user) 
			{
				return
			}

			console.log(  prisma.page.count())

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

	.query(
		"currentUser", 
		{

			async resolve ( input )
			{
				const { ctx } = input;
				
				if (!ctx.session?.user)
				{
					return
				}

				// if (!page)
				// {
				// 	throw new TRPCError({
				// 		code: "NOT_FOUND",
				// 		"message": `No page with id`,
				// 	})
				// }
			}
		})

	.query(
		"byId",
		{
			input: z.object({
				id: z.string().optional()
			}),

			async resolve ({ input })
			{
				const { id } = input

				const page = await prisma.page.findUnique({
					where: {
						id
					}
				})

				return page;
			}


		}
	)