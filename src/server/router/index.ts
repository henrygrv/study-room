// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { postRouter } from "./posts";
import { userRouter } from "./user";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("question.", protectedExampleRouter)
	.merge("posts.", postRouter)
	.merge("user.", userRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
