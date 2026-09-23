import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm bronze/amber accent scale — used sparingly against the
        // obsidian/zinc neutrals for hover states, badges and CTAs.
        bronze: {
          50: '#FAF6F0',
          100: '#F1E4D2',
          200: '#E2C7A3',
          300: '#D1A873',
          400: '#C08F52',
          500: '#A9753F',
          600: '#8B5E34',
          700: '#6E4A2A',
          800: '#4F3520',
          900: '#332216',
        },
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
