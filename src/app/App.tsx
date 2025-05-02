import "./App.css"
import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { ErrorSnackbar, Header } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import CircularProgress from "@mui/material/CircularProgress"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import styles from "./App.module.css"
import { useMeQuery } from "@/features/auth/api/authApi"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const [initialized, setInitialized] = useState(false)

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const { data, isLoading } = useMeQuery()

  useEffect(() => {
    if (isLoading) {
      setInitialized(true)
    }
    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedInAC({ isLoggedIn: true }))
    }
  }, [isLoading])

  if (!initialized) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
