import { createContext } from "react";

export const DarkThemeContext = createContext(
	{
		darkTheme: false,
		setDarkTheme: (value: boolean) => 
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		{},
	}
)