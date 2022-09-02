import { useSession, signIn, signOut } from "next-auth/react";

import Button from "../../base/button";

/**
 * Component that derives from the base button class and implements signIn 
 * and signOut functionality.
 */
const AuthButton = () =>
{
	const { data: session } = useSession();

	if (session) 
	{
		return (
			<>
				Signed in as {session?.user?.email} <br />
				{/* eslint-disable @typescript-eslint/no-misused-promises */}
				<Button onClick={() => signOut()}>Sign Out</Button>
			</>
		)
	}

	return (
		<>
			Not Signed In <br />
			<Button onClick={() => signIn()}>Sign In</Button>
		</>
	)
}

export default AuthButton;