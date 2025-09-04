## URL Shortener (React)

Run locally:

1. Install dependencies
   - `npm install`
2. Start dev server (port 3000)
   - `npm run dev`

Features:
- Shorten up to 5 URLs at once with optional validity (minutes) and custom code
- Client-side validation and unique short code generation
- Default validity 30 minutes if not specified
- Redirect handler at `/:code` with click tracking (timestamp, source, locale)
- Statistics page listing all links, expiry and detailed clicks
- Lightweight client logging stored in `localStorage`
