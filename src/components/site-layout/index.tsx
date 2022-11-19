import { FC, ReactNode } from "react";
import Header from "../header";

interface SiteLayoutProps
{
	children: ReactNode
}

const SiteLayout: FC<SiteLayoutProps> = (props) => 
{
	return(
		<div className="w-full h-screen bg-gradient-to-tr from-lime-100 via-yellow-100 to-lime-100">
			<Header />
			{props.children}
		</div>
	)
}

export default SiteLayout;