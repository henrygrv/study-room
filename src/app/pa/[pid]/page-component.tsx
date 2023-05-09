"use server";

import { prisma } from "../../../server/db/client";

export default async function PageComponent() 
{
	const page = await prisma.page.findMany();

	console.log(page)
}
