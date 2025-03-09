import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import BlogList from './pages/BlogList';
import BlogWrite from './pages/BlogWrite';
import BlogEdit from './pages/BlogEdit';

// 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container 
          maxWidth="lg" 
          disableGutters 
          sx={{ 
            px: { xs: '16px', md: '16px' },
            mx: 'auto'
          }}
        >
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/write" element={<BlogWrite />} />
            <Route path="/edit/:id" element={<BlogEdit />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
