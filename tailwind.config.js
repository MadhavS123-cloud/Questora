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
          50: '#FFF7ED',   // Soft orange highlight bg
          100: '#FFEDD5',
          500: '#F97316',  // Primary Brand Orange
          600: '#EA580C',  // Orange Hover
          700: '#C2410C',
          900: '#7C2D12',
        },
        neutral: {
          50: '#121212',   // Primary Dark Canvas Background
          100: '#1E1E1F',  // Elevated Layout Panel Background
          200: '#242426',  // Surface Container / Card Background
          300: '#2A2A2D',  // Subtle Border Tone
          400: '#3F3F46',  // Standard Border Color
          700: '#A1A1AA',  // Muted Label / Description Text
          800: '#F5F5F5',  // High-legibility Body Copy
          900: '#FFFFFF',  // Pure White Title Text
        },
        semantic: {
          success: '#22C55E', // Green Completed States
          warning: '#EA580C', // Orange warning/processing states
          error: '#EF4444',   // Red Validation Alerts
          ai: '#FF7A1A',      // Vibrant Orange AI Elements
        }
      },
      fontFamily: {
        ui: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
        examSerif: ['Georgia', 'Merriweather', 'serif'],
        examSans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 2px 8px -1px rgba(0, 0, 0, 0.2)',
        glow: '0 0 15px rgba(249, 115, 22, 0.15)',
      }
    },
  },
  plugins: [],
}
