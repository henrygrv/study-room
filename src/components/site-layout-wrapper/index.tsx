import { FC, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import Header from "../header";
import { DarkThemeContext } from "../../context/themeContext";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import PageNotFound from "../../pages/p/page-not-found";

interface SiteLayoutWrapperProps
{
	children: ReactNode
}

const SiteLayoutWrapper: FC<SiteLayoutWrapperProps> = (
	props
) => 
{
	const pid = useRouter().query.pid as string;
	const { data: userPreferences } = trpc.useQuery(
		["pages.getUserPreferences", { pid }]
	)
	
	const [darkTheme, setDarkTheme] = useState(userPreferences?.darkTheme);

	useEffect(() => 
	{
		setDarkTheme(userPreferences?.darkTheme);
		
	}, [userPreferences?.darkTheme])
	
	if (!userPreferences) 

	{
		return(
			<>

			</>
		)
	}
	

	return(
		<>

			<DarkThemeContext.Provider value={{ darkTheme: ( darkTheme as boolean), setDarkTheme }} >
				<div className={`w-full h-full lg:min-h-screen bg-gradient-to-tr ${darkTheme ? "from-gray-800 via-slate-700 to-zinc-600" : "from-lime-100 via-yellow-100 to-lime-100"}  flex flex-col scrollbar-thin scrollbar-thumb-gray-400 overflow-hidden`}>
					<Header />
					{props.children}
				</div>
			</DarkThemeContext.Provider>
		</>
	)
};

export default SiteLayoutWrapper;