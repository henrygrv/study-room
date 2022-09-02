import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server";


import { prisma } from "./../db/client";

export const userRouter = createProtectedRouter()
	.query(
		"byId",
		{
			input: z.object({
				id: z.string().optional(),
			}),
			async resolve({ input })
			{
				const { id } = input;

				const user = await prisma.user.findUnique({
					where: { id }
				});

				return user;

			}
		})
	.mutation(
		"nick",
		{
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