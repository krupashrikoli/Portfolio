# Portfolio — Event Planner / Experience Curator

Single-page portfolio built with **Next.js**, **Tailwind CSS**, **Framer Motion**, and **Lucide**.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Where to edit content

- **Main page**: `app/EventPortfolioPage.tsx`
- **Entry**: `app/page.tsx`
- **Global styles**: `app/globals.css`
- **Images**: `public/` (served by Next.js)

## Contact buttons

The contact section uses:
- **Mail button**: opens Gmail web on desktop, and the default mail app on mobile (with a prefilled template).
- **WhatsApp button**: opens WhatsApp chat via `wa.me` with a prefilled message.

Edit these constants in `app/EventPortfolioPage.tsx`:
- `CONTACT_EMAIL`
- `MAIL_SUBJECT`
- `MAIL_BODY`
- `WHATSAPP_PHONE_E164`
- `WHATSAPP_PREFILL`

## Deploy (Vercel)

1. Import the GitHub repo in Vercel
2. Framework preset: **Next.js**
3. Build command: `npm run build`
4. Output: default

