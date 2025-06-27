/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // Optimize for production builds
  corePlugins: {
    preflight: true,
  },
  // Purge unused CSS in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: [
        // Keep animation classes that might be added dynamically
        /^animate-/,
        /^transition-/,
        /^duration-/,
        /^ease-/,
        // Keep Framer Motion classes
        /^motion-/,
      ],
    },
  },
};