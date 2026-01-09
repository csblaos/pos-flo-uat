import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			ink: {
  				'50': '#f5f5f4',
  				'100': '#e7e5e4',
  				'200': '#d6d3d1',
  				'300': '#a8a29e',
  				'400': '#78716c',
  				'500': '#57534e',
  				'600': '#44403c',
  				'700': '#292524',
  				'800': '#1c1917',
  				'900': '#0c0a09'
  			},
  			citrus: {
  				'100': '#fff3c4',
  				'300': '#ffd166',
  				'500': '#f4a261',
  				'700': '#e76f51'
  			},
  			wave: {
  				'100': '#e0fbfc',
  				'300': '#98c1d9',
  				'500': '#3d5a80',
  				'700': '#293241'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			display: [
  				'Space Grotesk',
  				'sans-serif'
  			],
  			body: [
  				'IBM Plex Sans Thai',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			glow: '0 10px 40px rgba(61, 90, 128, 0.18)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
