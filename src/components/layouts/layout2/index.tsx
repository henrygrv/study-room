import { FC } from "react";
import { protectedExampleRouter } from "../../../server/router/protected-example-router";
import BlockContainer from "../../block-container";
import { LayoutProps } from "../../room-layout-provider";

const LayoutTwo: FC<LayoutProps> = (props) => 
{
	
	return (
		<>
			<div className={"h-full grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 grid-rows 4 justify-center w-full items-center"}>
				<BlockContainer className={"row-span-2"} id={0} userData={props.userData} user={props.user}>
					
				</BlockContainer>	
				
				<BlockContainer className={"row-span-2"} id={1} userData={props.userData} user={props.user}>
					
				</BlockContainer>	

			</div>
		</>
	)
}

export default LayoutTwo;