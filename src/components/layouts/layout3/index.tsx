import { FC } from "react";
import BlockContainer from "../../block-container";
import { LayoutProps } from "../../room-layout-provider";

const LayoutThree: FC<LayoutProps> = (props) => 
{
	
	return (
		<>
			<div className={"h-screen grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 grid-rows 4 justify-center w-full items-center"}>
				<BlockContainer className={"col-span-2"} id={0} pageData={props.pageData} user={props.user} />
				
				<BlockContainer className={""} id={1} pageData={props.pageData} user={props.user} />
					
				<BlockContainer className={""} id={2} pageData={props.pageData} user={props.user} />
			</div>
		</>
	)
}

export default LayoutThree;