// const { fontFamily } = require("tailwindcss/defaultTheme");

// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//   	extend: {
//   		fontFamily: {
//   			sans: [
//   				'Inter',
//                     ...fontFamily.sans
//                 ]
//   		},
//   		animation: {
//   			'accordion-down': 'accordion-down 0.2s ease-out',
//   			'accordion-up': 'accordion-up 0.2s ease-out'
//   		},
//   		keyframes: {
//   			'accordion-down': {
//   				from: {
//   					height: 0
//   				},
//   				to: {
//   					height: 'var(--radix-accordion-content-height)'
//   				}
//   			},
//   			'accordion-up': {
//   				from: {
//   					height: 'var(--radix-accordion-content-height)'
//   				},
//   				to: {
//   					height: 0
//   				}
//   			}
//   		},
//   		borderRadius: {
//   			lg: 'var(--radius)',
//   			md: 'calc(var(--radius) - 2px)',
//   			sm: 'calc(var(--radius) - 4px)'
//   		},
//   		colors: {
//   			background: 'hsl(var(--background))',
//   			foreground: 'hsl(var(--foreground))',
//   			card: {
//   				DEFAULT: 'hsl(var(--card))',
//   				foreground: 'hsl(var(--card-foreground))'
//   			},
//   			popover: {
//   				DEFAULT: 'hsl(var(--popover))',
//   				foreground: 'hsl(var(--popover-foreground))'
//   			},
//   			primary: {
//   				DEFAULT: 'hsl(var(--primary))',
//   				foreground: 'hsl(var(--primary-foreground))'
//   			},
//   			secondary: {
//   				DEFAULT: 'hsl(var(--secondary))',
//   				foreground: 'hsl(var(--secondary-foreground))'
//   			},
//   			muted: {
//   				DEFAULT: 'hsl(var(--muted))',
//   				foreground: 'hsl(var(--muted-foreground))'
//   			},
//   			accent: {
//   				DEFAULT: 'hsl(var(--accent))',
//   				foreground: 'hsl(var(--accent-foreground))'
//   			},
//   			destructive: {
//   				DEFAULT: 'hsl(var(--destructive))',
//   				foreground: 'hsl(var(--destructive-foreground))'
//   			},
//   			border: 'hsl(var(--border))',
//   			input: 'hsl(var(--input))',
//   			ring: 'hsl(var(--ring))',
//   			chart: {
//   				'1': 'hsl(var(--chart-1))',
//   				'2': 'hsl(var(--chart-2))',
//   				'3': 'hsl(var(--chart-3))',
//   				'4': 'hsl(var(--chart-4))',
//   				'5': 'hsl(var(--chart-5))'
//   			}
//   		}
//   	}
//   },
//   plugins: [
//     require("tailwindcss-animate"),
//   ],
// }



// const { fontFamily } = require("tailwindcss/defaultTheme");

// module.exports = {
// 	darkMode: ["class"],
// 	content: [
// 		"./index.html",
// 		"./src/**/*.{js,ts,jsx,tsx}",
// 	],
// 	theme: {
// 		extend: {
// 			fontFamily: {
// 				sans: ['Inter', ...fontFamily.sans],
// 			},
// 			fontSize: {
// 				base: '1.05rem',  // Default is 1rem (16px), so this is ~16.8px
// 				lg: '1.15rem',
// 				xl: '1.25rem',
// 			},
// 			fontWeight: {
// 				normal: '500', // Default is 400
// 				medium: '600', // Slightly stronger if needed
// 			},
// 			animation: {
// 				'accordion-down': 'accordion-down 0.2s ease-out',
// 				'accordion-up': 'accordion-up 0.2s ease-out',
// 			},
// 			keyframes: {
// 				'accordion-down': {
// 					from: { height: 0 },
// 					to: { height: 'var(--radix-accordion-content-height)' },
// 				},
// 				'accordion-up': {
// 					from: { height: 'var(--radix-accordion-content-height)' },
// 					to: { height: 0 },
// 				},
// 			},
// 			borderRadius: {
// 				lg: 'var(--radius)',
// 				md: 'calc(var(--radius) - 2px)',
// 				sm: 'calc(var(--radius) - 4px)',
// 			},
// 			colors: {
// 				background: 'hsl(var(--background))',
// 				foreground: 'hsl(var(--foreground))',
// 				card: {
// 					DEFAULT: 'hsl(var(--card))',
// 					foreground: 'hsl(var(--card-foreground))',
// 				},
// 				popover: {
// 					DEFAULT: 'hsl(var(--popover))',
// 					foreground: 'hsl(var(--popover-foreground))',
// 				},
// 				primary: {
// 					DEFAULT: 'hsl(var(--primary))',
// 					foreground: 'hsl(var(--primary-foreground))',
// 				},
// 				secondary: {
// 					DEFAULT: 'hsl(var(--secondary))',
// 					foreground: 'hsl(var(--secondary-foreground))',
// 				},
// 				muted: {
// 					DEFAULT: 'hsl(var(--muted))',
// 					foreground: 'hsl(var(--muted-foreground))',
// 				},
// 				accent: {
// 					DEFAULT: 'hsl(var(--accent))',
// 					foreground: 'hsl(var(--accent-foreground))',
// 				},
// 				destructive: {
// 					DEFAULT: 'hsl(var(--destructive))',
// 					foreground: 'hsl(var(--destructive-foreground))',
// 				},
// 				border: 'hsl(var(--border))',
// 				input: 'hsl(var(--input))',
// 				ring: 'hsl(var(--ring))',
// 				chart: {
// 					'1': 'hsl(var(--chart-1))',
// 					'2': 'hsl(var(--chart-2))',
// 					'3': 'hsl(var(--chart-3))',
// 					'4': 'hsl(var(--chart-4))',
// 					'5': 'hsl(var(--chart-5))',
// 				},
// 			},
// 		},
// 	},
// 	plugins: [
// 		require("tailwindcss-animate"),
// 		require("daisyui"),
// 	],
// }

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...fontFamily.sans],
			},
			fontSize: {
				base: '1.05rem',
				lg: '1.15rem',
				xl: '1.25rem',
			},
			fontWeight: {
				normal: '500',
				medium: '600',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("daisyui"),
	],
	daisyui: {
		themes: ["light", "dark"], // keep it minimal to avoid overriding shadcn styles
		prefix: "dui-", // ✅ prevents class conflicts like `btn`, `card`, etc.
		styled: true,
		base: true,
		utils: true,
		logs: false,
		rtl: false,
	},
};
