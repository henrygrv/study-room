import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";``

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { trpc } from "../../../utils/trpc";
import router from "next/router";

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, user }) 
		{
			if (session.user) 
			{
				session.user.id = user.id;
			}
			return session;
		},

	},
	events: {
		async signIn(message)
		{
			if (message.isNewUser)
			{
				const page = await prisma.page.create({
					data: {
						user: {
							connect: {
								id: message.user.id
							}
						}
					},
				})
			}
		}
	},
	// Configure authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,

		}),
	],
};

export default NextAuth(authOptions);
