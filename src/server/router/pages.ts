import { number, string, z } from "zod";
import { createRouter } from "./context";

import { prisma } from "./../db/client"
import { TRPCError } from "@trpc/server";
import { PageData } from "../../pages/p/[pid]";
import { Page } from "@prisma/client";

import { defaultPageData } from "../../pages/api/auth/[...nextauth]";

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
					},
					select: {
						id: true,
						createdAt: true,
						updatedAt: true,
					}
				})

				return page;
			}


		}
	)

	.query(
		"getData",
		{
			input: z.object({
				pid: z.string(),
			}),

			async resolve({ input })
			{
				const { pid: id } = input;

				const pagePrefs = await prisma.page.findUnique({
					where: { id },
					select: {
						pageData: true,
					}
				});

				const pageData = pagePrefs?.pageData

				if (pageData) 
				{
					return {
						layout: (pageData as any).layout,
						schema: (pageData as any).schema,
						blocks: (pageData as any).blocks as { block: { id: number, type: string, content?: string} }[],
						userPreferences: (pageData as any)?.pageData
					} as PageData
				}
			}
		}
	)
	.mutation(
		"updateData",
		{
			input: z.object({
				pid: z.string(),
				data: z.object({
					schema: z.string(),
					layout: z.number(),
					blocks: z.array(z.object({
						block:z.object({
							id: z.number(),
							type: z.string(),
							content: z.string().or(number()).optional()
						})
					})),
					userPreferences: z.object({

					})
				})
			}),

			async resolve({ input })
			{
				const { pid: id, data } = input;
				
				const updateData = await prisma.page.update({
					where: { id },
					data: {
						pageData: data
					}
				});
				
				return updateData;
			}
		}
	)
	.mutation(
		"resetPageData",
		{
			input: z.object({
				pid: z.string(),
			}),

			async resolve({ input })
			{
				const { pid } = input;

				const resetData = await prisma.page.update({
					where: { id: pid },
					data: {
						pageData: defaultPageData
					}
				});

				return resetData;
			}
		})
	
