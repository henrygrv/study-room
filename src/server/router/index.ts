// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { postRouter } from "./posts";
import { userRouter } from "./user";
import { pageRouter } from "./pages";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("question.", protectedExampleRouter)
	.merge("posts.", postRouter)
	.merge("users.", userRouter)
	.merge("pages.", pageRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
