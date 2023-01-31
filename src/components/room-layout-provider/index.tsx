import { User } from "@prisma/client"
import React from "react"
import { FC, ReactNode } from "react"
import { PageData } from "../../pages/p/[pid]"
import BaseLayout from "../layouts/base-layout"
import LayoutTwo from "../layouts/layout2"
import LayoutThree from "../layouts/layout3"

// Define and enumerate the different layout options
export enum Layout
{
	Base,
	SideBySide,
	LargeOnTop,
}

// Interface for all layouts to use
export interface LayoutProps 
{
	user: User
	children?: string | ReactNode
	pageData: PageData 
}

// Interface for the RoomLayout Wrapper to use
interface RoomLayoutProps extends LayoutProps 
{
	layout: Layout
}

// Wrapper for deciding which layout the user has selected 
const RoomLayoutProvider: FC<RoomLayoutProps> = (props) => 
{
	const determineRoomLayout = () => 
	{

		switch (props.layout) 
		{
		case Layout.Base:
			return <BaseLayout user={props.user} pageData={props.pageData}/>
		case Layout.SideBySide:
			return <LayoutTwo user={props.user} pageData={props.pageData}/>
		case Layout.LargeOnTop:
			return <LayoutThree user={props.user} pageData={props.pageData}/>
		default:
			break;
		}
	}	

	return(
		<>
			{determineRoomLayout()}
		</>
	)
}

export default RoomLayoutProvider;