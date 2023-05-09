import PageComponent from "./page-component"

export const metadata = {
	title: "lskdjflk"
}

export default function PPageLayout({
	children
}: {
	children: React.ReactNode
}) {

	return (
		<html lang="en-gb">
			<body>{children}</body>
			<PageComponent />
		</html>
	)
}
