import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightGreen, orange } from '@mui/material/colors'

import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import DetailedFeaturesToCityPage from "./pages/DetailedFeaturesToCityPage";
import EduGrowthToStatePage from "./pages/EduGrowthToStatePage";
import SchoolToCityPage from "./pages/SchoolToCityPage";
import SchoolFilterPage from "./pages/SchoolFilterPage";

// TODO customize the theme
export const theme = createTheme({
  palette: {
    primary: lightGreen,
    secondary: orange,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/query7" element={<DetailedFeaturesToCityPage />} />
          <Route path="/query5" element={<SchoolToCityPage />} />
          <Route path="/query3-8" element={<EduGrowthToStatePage />} />
          <Route path="/query6" element={<SchoolFilterPage />} />
          {/* TODO have to add the other route to the query page and create those query pages*/}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}