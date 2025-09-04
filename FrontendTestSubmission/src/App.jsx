import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

function App() {
  return (
    <Box
    sx={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background:
        'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 40%, #e2e8f0 100%)',
    }}
  >
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(90deg,rgb(93, 144, 228) 0%,rgb(77, 106, 153) 100%)',
      }}
    >
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 700, color: 'white' }}
        >
          URL Shortener
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            component={Link}
            to="/"
            variant="text"
            sx={{ color: 'white', fontWeight: 600 }}
          >
            Shorten
          </Button>
          <Button
            component={Link}
            to="/stats"
            variant="text"
            sx={{ color: 'white', fontWeight: 600 }}
          >
            Statistics
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  

      <Container sx={{ flex: 1, py: { xs: 2, md: 4 } }} maxWidth="md">
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path=":code" element={<RedirectHandler />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
      <Box component="footer" sx={{ textAlign: 'center', py: 1, color: 'text.secondary', fontSize: 12 }}>URL Shortener</Box>
    </Box>
  )
}

function ShortenerPage() {
  return <UrlShortener />
}

function RedirectHandler() {
  return <UrlRedirect />
}

function StatsPage() {
  return <UrlStats />
}

import UrlShortener from './components/UrlShortener.jsx'
import UrlRedirect from './components/UrlRedirect.jsx'
import UrlStats from './components/UrlStats.jsx'

export default App
