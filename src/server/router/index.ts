// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { pageRouter } from "./pages";

// connect all api routes together
export const appRouter = createRouter()
	.transformer(superjson)
	.merge("users.", userRouter)
	.merge("pages.", pageRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
