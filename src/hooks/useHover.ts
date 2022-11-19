import { CSSProperties, useState } from "react";

export function useHover(
	styleOnHover: CSSProperties, 
	styleOnNotHover: CSSProperties = {},
) 
{
	// track current style
	const [style, setStyle] = useState(styleOnNotHover);

	// Define behavior for mouse on and mouse off events 
	const onMouseEnter = () => setStyle(styleOnHover);
	const onMouseLeave = () => setStyle(styleOnNotHover);

	return { style, onMouseEnter, onMouseLeave };
}