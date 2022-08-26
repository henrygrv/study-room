import { useSession, signIn, signOut } from "next-auth/react";

const SignInComponent = () =>
{
	const { data: session } = useSession();

	if (session) 
	{
		return (
			<>
				Signed in as {session?.user?.email} <br />
				{/* eslint-disable @typescript-eslint/no-misused-promises */}
				<button onClick={() => signOut()}>Sign Out</button>
			</>
		)
	}

	return (
		<>
			Not Signed In <br />
			<button onClick={() => signIn()}>Sign In</button>
		</>
	)
}

export default SignInComponent;