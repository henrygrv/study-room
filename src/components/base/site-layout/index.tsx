import { FC, ReactNode } from "react";
import Header from "../header";

interface SiteLayoutProps
{
	children: ReactNode
}

const SiteLayout: FC<SiteLayoutProps> = (props) => 
{
	return(
		<>
			<Header />
			{props.children}
		</>
	)
}

export default SiteLayout;