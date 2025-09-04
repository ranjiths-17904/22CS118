import { useMemo } from 'react'
import { getAll } from './services/storage'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function UrlStats() {
  const data = useMemo(() => getAll(), [])

  if (data.length === 0) return <Typography>No links yet. Create some on the Shorten page.</Typography>

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h5" fontWeight={800} sx={{
          background: 'linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Statistics</Typography>
      </Grid>
      {data.map((item) => (
        <Grid key={item.code} size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography fontWeight={700}>{window.location.origin}/{item.code}</Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(item.createdAt).toLocaleString()} | Expires: {new Date(item.expireAt).toLocaleString()}
              </Typography>
              <Typography sx={{ mt: 1 }} fontWeight={600}>Total clicks: {item.clicks.length}</Typography>
              {item.clicks.length > 0 && (
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  {item.clicks.map((c, i) => (
                    <Grid key={i} size={12}>
                      <Typography variant="body2">{new Date(c.at).toLocaleString()} — Source: {c.source} — Locale: {c.locale}</Typography>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}


