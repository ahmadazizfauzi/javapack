import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        // Dark Theme Surfaces & Borders (01. Design Tokens)
        surface: {
          canvas: "#080C14",
          sidebar: "#0B0F19",
          card: "#0F172A",
          elevated: "#1E293B",
          border: "#334155",
          muted: "#64748B",
          subtle: "#94A3B8",
          foreground: "#F8FAFC",
        },
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        // MEJIKUHIBINIU Design System Palette
        red: {
          50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#FCA5A5", 400: "#F87171",
          500: "#EF4444", 600: "#DC2626", 700: "#B91C1C", 800: "#991B1B", 900: "#7F1D1D",
        },
        rose: {
          50: "#FFF1F2", 100: "#FFE4E6", 200: "#FECDD3", 300: "#FDA4AF", 400: "#FB7185",
          500: "#F43F5E", 600: "#E11D48", 700: "#BE123C", 800: "#9F1239", 900: "#881337",
        },
        orange: {
          50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 300: "#FDBA74", 400: "#FB923C",
          500: "#F97316", 600: "#EA580C", 700: "#C2410C", 800: "#9A3412", 900: "#7C2D12",
        },
        yellow: {
          50: "#FEFCE8", 100: "#FEF9C3", 200: "#FEF08A", 300: "#FDE047", 400: "#FACC15",
          500: "#EAB308", 600: "#CA8A04", 700: "#A16207", 800: "#854D0E", 900: "#713F12",
        },
        amber: {
          50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24",
          500: "#F59E0B", 600: "#D97706", 700: "#B45309", 800: "#92400E", 900: "#78350F",
        },
        green: {
          50: "#F0FDF4", 100: "#DCFCE7", 200: "#BBF7D0", 300: "#86EFAC", 400: "#4ADE80",
          500: "#22C55E", 600: "#16A34A", 700: "#15803D", 800: "#166534", 900: "#14532D",
        },
        emerald: {
          50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 300: "#6EE7B7", 400: "#34D399",
          500: "#10B981", 600: "#059669", 700: "#047857", 800: "#065F46", 900: "#064E3B",
        },
        cyan: {
          50: "#ECFEFF", 100: "#CFFAFE", 200: "#A5F3FC", 300: "#67E8F9", 400: "#22D3EE",
          500: "#06B6D4", 600: "#0891B2", 700: "#0E7490", 800: "#155E75", 900: "#164E63",
        },
        blue: {
          50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE", 300: "#93C5FD", 400: "#60A5FA",
          500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8", 800: "#1E40AF", 900: "#1E3A8A",
        },
        indigo: {
          50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC", 400: "#818CF8",
          500: "#6366F1", 600: "#4F46E5", 700: "#4338CA", 800: "#3730A3", 900: "#312E81",
        },
        purple: {
          50: "#FAF5FF", 100: "#F3E8FF", 200: "#E9D5FF", 300: "#D8B4FE", 400: "#C084FC",
          500: "#A855F7", 600: "#9333EA", 700: "#7E22CE", 800: "#6B21A8", 900: "#581C87",
        },
        grey: {
          50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB", 400: "#9CA3AF",
          500: "#6B7280", 600: "#4B5563", 700: "#374151", 800: "#1F2937", 900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
export default config;
