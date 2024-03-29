// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";
import SiteLayoutWrapper from "../components/site-layout-wrapper";
import type { AppRouter } from "../server/router";
import "../styles/globals.css"
import { AppType } from "next/app";
import { Session } from "next-auth";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => 
{
	return (
		<SessionProvider session={session}>
			<SiteLayoutWrapper>
				<Component {...pageProps} />
			</SiteLayoutWrapper>
		</SessionProvider>
	);
};

const getBaseUrl = () => 
{
	if (typeof window !== undefined) return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config() 
	{
		/**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
   * @link https://trpc.io/docs/ssr
   */
	ssr: false,
})(MyApp);
