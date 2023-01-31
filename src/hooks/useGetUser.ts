import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

export default function useGetUser()
{
	const { data: session }  = useSession();

	let uid;
	if (session && session.user)
	{
		uid = session.user.id
	}
	
	const userDetails = trpc.useQuery(["users.byId", { id: uid }])
	
	if (userDetails)
	{
		if (userDetails.data) 
		{
			const user = userDetails.data;
			const pageUrl = `/p/${user.pageId}`;
			
			return { user,  pageUrl } ;
		}
		
	}
	return { user: null, pageUrl: null };
}