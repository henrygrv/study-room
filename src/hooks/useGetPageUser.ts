
import { trpc } from "../utils/trpc";
import type { User } from "@prisma/client";

export default function useGetPageUser(pid: string)
{
	const userDetails = trpc.useQuery(["users.byPageId", { pid }])


	if (userDetails)
	{
		if (userDetails.data) 
		{
			const user = userDetails.data;
			if (user) 
			{
				const pageUser = ( user as unknown ) as User
				const pageUrl = `/p/${pageUser.pageId}`;
				
				return { pageUser, pageUrl } ;

			}
		}
		
	}
	return { pageUser: null, pageUrl: null };
}