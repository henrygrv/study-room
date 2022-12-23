/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "1rem",
		},
		fontFamily: {
			"serif": ["Playfair Display"]
		}

	},
	plugins: [
		require("tailwind-scrollbar")
	],
};

