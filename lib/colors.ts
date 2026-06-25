export const COLORS = {
  light: {
    white: "#FFFFFF",
    white100: "#E2E8F2",
    white200: "#CBD5E1",
    white300: "#94A3B8",
    black: "#011627",
    black100: "#0A2240",
    black200: "#132D52",
    gray: "#4A5568",
    gray100: "#64748B",
    gray200: "#94A3B8",
    gray300: "#CBD5E1",

    primary: "#2979FF",
    primary100: "#E8F0FF",
    primary200: "#C5D9FF",
    primary300: "#5C9AFF",
    secondary: "#00C8E8",
    secondary100: "#E0FAFF",
    secondary200: "#B3F0FF",
    secondary300: "#66E5FF",

    text: "#011627",
    background: "#F4F7FC",
    success: "#22C997",
    error: "#EF4444",
    warning: "#FFD740",
    gradientBg: ["#EDE7FF", "#F4F7FC"] as const,
  },
  dark: {
    white: "#0A1E35",
    white100: "#132D52",
    white200: "#1A3A66",
    white300: "#244B7A",
    black: "#F0F4FA",
    black100: "#E2E8F0",
    black200: "#CBD5E1",
    gray: "#94A3B8",
    gray100: "#64748B",
    gray200: "#475569",
    gray300: "#334155",

    primary: "#4D9AFF",
    primary100: "#0D2847",
    primary200: "#143458",
    primary300: "#1E4A75",
    secondary: "#00E5FF",
    secondary100: "#0A2430",
    secondary200: "#0F3340",
    secondary300: "#154555",

    text: "#F0F4FA",
    background: "#011627",
    success: "#4ADE80",
    error: "#FF6B6B",
    warning: "#FFD740",
    gradientBg: ["#0F1A3D", "#011627"] as const,
  },
} as const;

/** CSS variables in styles/globals.css mirror these tokens. */
export type ThemeMode = keyof typeof COLORS;
export type AppColors = (typeof COLORS)[ThemeMode];
