import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Historial } from './pages/Historial/Historial'
import { Layout } from './components/Layout/Layout'
import { Graficas } from './pages/Graficas/Graficas'
import { Riego } from './pages/Riego/Riego'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f4f7f4',
    },
    primary: {
      main: '#10b981',
    },
    secondary: {
      main: '#0ea5e9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem', 
        },
      },
    },
  },
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/historial" replace />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/graficas" element={<Graficas />} />
            <Route path="/riego" element={<Riego />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App