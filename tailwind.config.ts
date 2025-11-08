import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  safelist: [
    'bg-accent-pink',
    'bg-accent-pink/15',
    'border-accent-pink/30',
    'bg-accent-blue',
    'bg-accent-blue/15',
    'border-accent-blue/30',
    'bg-accent-amber',
    'bg-accent-amber/15',
    'border-accent-amber/30',
    'bg-accent-lime',
    'bg-accent-lime/15',
    'border-accent-lime/30',
    'bg-accent-teal',
    'bg-accent-teal/15',
    'border-accent-teal/30',
    'bg-accent-violet',
    'bg-accent-violet/15',
    'border-accent-violet/30',
    'bg-accent-cyan',
    'bg-accent-cyan/15',
    'border-accent-cyan/30',
    'bg-accent-red',
    'bg-accent-red/15',
    'border-accent-red/30'
  ],
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B0D10",
        surface: "#111418",
        elevated: "#151A1F",
        border: {
          subtle: "#1D232B"
        },
        text: {
          primary: "#E9EDF1",
          secondary: "#B2BCC9",
          muted: "#6B7684"
        },
        cta: {
          pink: "#F11D75"
        },
        accent: {
          pink: "#F11D75",
          teal: "#16C7A8",
          blue: "#3A8DFF",
          violet: "#8B5CF6",
          lime: "#45E06F",
          amber: "#FFB020",
          red: "#FF5C5C",
          cyan: "#22D3EE"
        },
        state: {
          success: "#26D07C",
          warning: "#FFB020",
          danger: "#FF5C5C"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system"]
      },
      borderRadius: {
        card: "10px",
        pill: "999px"
      },
      boxShadow: {
        overlay: "0 4px 16px rgba(0, 0, 0, 0.3)"
      }
    }
  },
  plugins: [animate]
};

export default config;
