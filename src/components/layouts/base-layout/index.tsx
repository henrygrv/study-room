import { FC } from "react";
import BlockContainer from "../../block-container";
import { LayoutProps } from "../../room-layout-provider";

const BaseLayout: FC<LayoutProps> = (props) => 
{
	return (
		<>
			<div className={"h-screen grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 grid-rows-4 justify-center w-full items-center"}>
				<BlockContainer 
					user={props.user} className={""} 
					pageData={props.pageData} id={0} 
				/>
				<BlockContainer 
					user={props.user} className={""} 
					pageData={props.pageData} id={1} 
				/>
				<BlockContainer 
					user={props.user} className={""} 
					pageData={props.pageData} id={2} 
				/>
				<BlockContainer 
					user={props.user} className={""} 
					pageData={props.pageData} id={3} 
				/>
			</div>
		</>
	)
}

export default BaseLayout;