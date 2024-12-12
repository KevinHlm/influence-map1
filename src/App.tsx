import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import { ToolsPage } from './pages/ToolsPage';
import { HomePage } from './pages/HomePage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#059669',
    },
    secondary: {
      main: '#dc2626',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools/:tool" element={<ToolsPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
