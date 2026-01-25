import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Neutrals
        bg: {
          base: '#0B0D10',
          surface: '#111418',
          elevated: '#151A1F',
        },
        border: {
          subtle: '#1D232B',
        },
        text: {
          primary: '#E9EDF1',
          secondary: '#B2BCC9',
          muted: '#6B7684',
        },
        // Brand/CTA
        cta: {
          pink: '#F11D75',
        },
        // Category Accent Pool
        accent: {
          pink: '#F11D75',
          teal: '#16C7A8',
          blue: '#3A8DFF',
          violet: '#8B5CF6',
          lime: '#45E06F',
          amber: '#FFB020',
          red: '#FF5C5C',
          cyan: '#22D3EE',
        },
        // State colors
        success: '#26D07C',
        warning: '#FFB020',
        danger: '#FF5C5C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.2', fontWeight: '600' }],     // 48px
        'h1': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],       // 32px
        'h2': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],     // 24px
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],    // 20px
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],     // 16px
        'label': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }], // 14px
        'small': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],  // 12px
      },
      spacing: {
        '4.5': '1.125rem',  // 18px
      },
      borderRadius: {
        'component': '10px',
        'chip': '16px',
        'pill': '999px',
      },
      boxShadow: {
        'modal': '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-5px) scale(1.02)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "fade-out": "fade-out 150ms ease-in",
        "slide-in": "slide-in-from-right 200ms ease-out",
        "slide-out": "slide-out-to-right 200ms ease-in",
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
 
export default config
