import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 18px 60px rgba(15, 23, 42, 0.14)'
      },
      colors: {
        ink: '#0f172a',
        mist: '#e2e8f0',
        accent: {
          DEFAULT: 'hsl(var(--a))',
          foreground: 'hsl(var(--af))'
        },
        coral: '#d97706',
        background: 'hsl(var(--b))',
        foreground: 'hsl(var(--fg))',
        card: {
          DEFAULT: 'hsl(var(--c))',
          foreground: 'hsl(var(--cf))'
        },
        popover: {
          DEFAULT: 'hsl(var(--pop))',
          foreground: 'hsl(var(--popf))'
        },
        primary: {
          DEFAULT: 'hsl(var(--p))',
          foreground: 'hsl(var(--pf))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--s))',
          foreground: 'hsl(var(--sf))'
        },
        muted: {
          DEFAULT: 'hsl(var(--m))',
          foreground: 'hsl(var(--mf))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--d))',
          foreground: 'hsl(var(--df))'
        },
        border: 'hsl(var(--bd))',
        input: 'hsl(var(--in))',
        ring: 'hsl(var(--r))',
        chart: {
          '1': 'hsl(var(--ch1))',
          '2': 'hsl(var(--ch2))',
          '3': 'hsl(var(--ch3))',
          '4': 'hsl(var(--ch4))',
          '5': 'hsl(var(--ch5))'
        }
      },
      borderRadius: {
        lg: 'var(--rd)',
        md: 'calc(var(--rd) - 2px)',
        sm: 'calc(var(--rd) - 4px)'
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;

