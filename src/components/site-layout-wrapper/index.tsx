import { FC, ReactElement, ReactNode } from "react";
import Header from "../header";

interface SiteLayoutWrapperProps
{
	children: ReactNode
}

const SiteLayoutWrapper: FC<SiteLayoutWrapperProps> = (
	props
): ReactElement => 
{
	return(
		<div className="w-full min-h-screen bg-gradient-to-tr from-lime-100 via-yellow-100 to-lime-100 flex flex-col scrollbar-thin scrollbar-thumb-gray-400 overflow-hidden">
			<Header />
			{props.children}
		</div>
	)
};

export default SiteLayoutWrapper;