import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createProtectedRouter()
	.query(
		"getAll", {
			resolve({ ctx }) 
			{
				return ctx.session.user.id;
			}
		})