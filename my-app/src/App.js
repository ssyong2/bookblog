import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import BlogList from './pages/BlogList';
import BlogWrite from './pages/BlogWrite';
import BlogEdit from './pages/BlogEdit';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/write" element={<BlogWrite />} />
          <Route path="/edit/:id" element={<BlogEdit />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 