
export const brandColors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe", 
    500: "#0891b2",
    600: "#0e7490",
    900: "#164e63"
  },
  secondary: {
    50: "#fef3c7",
    100: "#fde68a",
    500: "#f59e0b",
    600: "#d97706"
  },
  accent: {
    teal: "#06b6d4",
    coral: "#f43f5e",
    lime: "#84cc16"
  }
};

export type BackgroundColor = keyof typeof brandColors.primary | keyof typeof brandColors.secondary;
