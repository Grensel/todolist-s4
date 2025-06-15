import type { ThemeMode } from "@/app/app-slice"
import { createTheme } from "@mui/material/styles"

export const getTheme = (themeMode: ThemeMode) => {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "rgb(8, 81, 164)",
      },
      background: {
        default: themeMode === "dark" ? "rgb(20, 20, 20)" : "rgb(228, 240, 255)", // Цвет фона
        paper: themeMode === "dark" ? "#1e1e1e" : "rgb(250, 252, 255)", // Цвет бумаги
      },
    },
  })
}
