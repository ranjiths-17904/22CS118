import { useMemo, useState } from 'react'
import { upsertLink, isValidUrl, getAll } from './services/storage'
import { logEvent } from './services/logger'
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack
} from '@mui/material';


function Row({ index, value, onChange, onRemove, error }) {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Long URL" placeholder="https://example.com/article" value={value.longUrl} onChange={(e) => onChange(index, { ...value, longUrl: e.target.value })} error={Boolean(error)} helperText={error || ''} />
      </Grid>
      <Grid size={{ xs: 6, md: 2 }}>
        <TextField fullWidth label="Validity (min)" type="number" inputProps={{ min: 1 }} value={value.minutes} onChange={(e) => onChange(index, { ...value, minutes: e.target.value ? parseInt(e.target.value, 10) : '' })} />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <TextField fullWidth label="Preferred code (optional)" value={value.code} onChange={(e) => onChange(index, { ...value, code: e.target.value })} />
      </Grid>
      <Grid size={{ xs: 12, md: 1 }}>
        <Button fullWidth variant="contained" color="error" onClick={() => onRemove(index)} sx={{ textTransform: 'none' }}>Remove</Button>
      </Grid>
    </Grid>
  )
}

export default function UrlShortener() {
  const [rows, setRows] = useState([{ longUrl: '', minutes: '', code: '' }])
  const [errors, setErrors] = useState({})
  const [results, setResults] = useState([])

  const canAdd = rows.length < 5

  function updateRow(idx, val) {
    setRows((r) => r.map((x, i) => (i === idx ? val : x)))
  }
  function removeRow(idx) {
    setRows((r) => r.filter((_, i) => i !== idx))
  }

  function validate() {
    const errs = {}
    rows.forEach((r, i) => {
      if (!isValidUrl(r.longUrl)) errs[i] = 'Enter a valid http(s) URL'
      if (r.minutes !== '' && (!Number.isInteger(r.minutes) || r.minutes <= 0)) errs[i] = 'Validity must be a positive integer'
      if (r.code && !/^[a-zA-Z0-9]+$/.test(r.code)) errs[i] = 'Code must be alphanumeric'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleShorten() {
    if (!validate()) return
    const created = []
    try {
      rows.forEach((r) => {
        const item = upsertLink({ longUrl: r.longUrl.trim(), minutes: r.minutes === '' ? undefined : r.minutes, code: r.code?.trim() })
        created.push(item)
      })
      logEvent('shorten_created', { count: created.length })
      setResults(created)
      setRows([{ longUrl: '', minutes: '', code: '' }])
    } catch (e) {
      alert(e.message)
    }
  }

  const existing = useMemo(() => getAll(), [results])

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h5" fontWeight={800} sx={{
          background: 'linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>URL Shortener</Typography>
      </Grid>

      <Grid size={12}>
        <Grid container spacing={1}>
          {rows.map((r, i) => (
            <Grid key={i} size={12}>
              <Row index={i} value={r} onChange={updateRow} onRemove={removeRow} error={errors[i]} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          {canAdd && (
            <Button variant="contained" onClick={() => setRows((r) => [...r, { longUrl: '', minutes: '', code: '' }])} sx={{
              background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
              textTransform: 'none'
            }}>Add URL</Button>
          )}
          <Button variant="contained" onClick={handleShorten} sx={{
            background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
            textTransform: 'none'
          }}>Shorten</Button>
        </Stack>
      </Grid>

      {results.length > 0 && (
        <Grid size={12}>
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>Created Links</Typography>
          <Grid container spacing={1}>
            {results.map((r) => (
              <Grid key={r.code} size={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography fontWeight={700}>{window.location.origin}/{r.code}</Typography>
                    <Typography variant="body2" color="text.secondary">Expires: {new Date(r.expireAt).toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Original: {r.longUrl}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component="a" href={`/${r.code}`} sx={{ textTransform: 'none' }}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

      {existing.length > 0 && (
        <Grid size={12}>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>Existing Links</Typography>
          <Grid container spacing={1}>
            {existing.map((r) => (
              <Grid key={r.code} size={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography fontWeight={700}>{window.location.origin}/{r.code}</Typography>
                    <Typography variant="body2" color="text.secondary">Expires: {new Date(r.expireAt).toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Original: {r.longUrl}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component="a" href={`/${r.code}`} sx={{ textTransform: 'none' }}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}


