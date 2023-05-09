import { createContext } from "react";

export const DarkThemeContext = createContext<{
	darkTheme: boolean,
	setDarkTheme: (value: boolean) => void

		}>
		(
		{
			darkTheme: false,
			setDarkTheme: (value: boolean) =>
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			{ },
		}
		)
