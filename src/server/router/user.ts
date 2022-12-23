import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server";


import { prisma } from "./../db/client";

export const userRouter = createProtectedRouter()
	.query(
		"byId",
		{
			// define input shape
			input: z.object({
				id: z.string().optional(),
			}),
			async resolve({ ctx, input })
			{
				let { id } = input;
				if (!id) 
				{
					id = ctx.session.user.id;
				}
				const user = await prisma.user.findUnique({
					where: { id },
				
				});

				return user;

			}
		})
	.query(
		"byPageId",
		{
			// define input shape
			input: z.object({
				pid: z.string(),
			}),
			async resolve({ ctx, input })
			{
				const { pid } = input;
				
				// raw query 
				const user = await prisma.user.findRaw({
					filter: { pageId: { $eq: pid } }
				});

				return user;

			}
		})
			
	.mutation(
		"nick",
		{
			//define input shape
			input: z.object({
				id: z.string(),
				nickname: z.string(),
			}),
			async resolve({ input })
			{
				const { id, nickname } = input;

				const nick = await prisma.user.update({
					where: { id },
					data: {
						nickname: nickname
					}
				});
			}
		}
	)
