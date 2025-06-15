import type { ThemeMode } from "@/app/app-slice"
import { createTheme } from "@mui/material/styles"

export const getTheme = (themeMode: ThemeMode) => {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "rgb(8, 81, 164)",
      },
    },
  })
}
