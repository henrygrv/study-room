import { FC } from "react";
import BlockContainer from "../../block-container";
import { LayoutProps } from "../../room-layout-provider";

const BaseLayout: FC<LayoutProps> = (props) => 
{
	

	return (
		<>
			<div className={"h-full grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 grid-rows 4 justify-center w-full items-center"}>
				<BlockContainer user={props.user} className={""} userData={props.userData} id={0}>
					
				</BlockContainer>	
				
				<BlockContainer user={props.user} className={""} userData={props.userData} id={1}>
					
				</BlockContainer>	
				<BlockContainer user={props.user} className={""} userData={props.userData} id={2}>
					
				</BlockContainer>	
				<BlockContainer user={props.user} className={""} userData={props.userData} id={3}>
					
				</BlockContainer>	
			</div>
		</>
	)
}

export default BaseLayout;