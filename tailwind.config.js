/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',   // Light highlights
          100: '#E0E7FF',
          500: '#6366F1',  // AI accent violet
          600: '#4F46E5',  // Indigo primary brand color
          700: '#4338CA',
          900: '#312E81',  // Deep navy text
        },
        neutral: {
          50: '#F8FAFC',   // Calming slate-grey canvas bg
          100: '#F1F5F9',  // Inactive borders
          200: '#E2E8F0',
          300: '#CBD5E1',
          700: '#334155',
          800: '#1E293B',  // High-legibility body slate
          900: '#0F172A',  // Midnight text
        },
        semantic: {
          success: '#16A34A', // Complete indicator
          warning: '#D97706', // Processing/Warning amber
          error: '#DC2626',   // Error red
          ai: '#8B5CF6',      // AI magical indigo-purple
        }
      },
      fontFamily: {
        ui: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
        examSerif: ['Georgia', 'Merriweather', 'serif'],
        examSans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(79, 70, 229, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.02)',
        glow: '0 0 15px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
