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
				const user = await prisma.user.findUnique({
					where: {
						pageId: pid,
					}
				})

				return user;

			}
		})
			
	.mutation(
		"nick",
		{
			//define input shape
			input: z.object({
				id: z.string().optional(),
				nickname: z.string(),
			}),
			async resolve({ ctx, input })
			{
				const { nickname } = input;
				
				// Use inputted id or use id from context
				const id = input.id ? input.id : ctx.session.user.id

				const nick = await prisma.user.update({
					where: { id },
					data: {
						nickname: nickname
					}
				});
			}
		}
	)
	.mutation(
		"email",
		{
			//define input shape
			input: z.object({
				id: z.string().optional(),
				email: z.string().email(),
			}),
			async resolve({ ctx, input })
			{
				const { email } = input;

				// Use inputted id or use id from context
				const id = input.id? input.id : ctx.session.user.id

				const emailUpdate = await prisma.user.update({
					where: { id },
					data: {
						email: email
					}
				});
			},
		}
	)
	.mutation(
		"remove",
		{
			input: z.object({
				id: z.string(),
			}),
			async resolve({ input })
			{
				const { id } = input;

				const deleteUser = await prisma.user.delete({
					where: { id },
				});
			}
		}
	)
