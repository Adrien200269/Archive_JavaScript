<<<<<<< HEAD
# Archive Outfitters – Auth Module

Frontend authentication pages built with Next.js 14 (App Router), matching the Archive Outfitters design.

## Pages & Routes

| Route       | Page             |
|-------------|------------------|
| `/`         | Splash screen    |
| `/login`    | Login form       |
| `/register` | Registration form |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```

## Project Structure

```
app/
├── layout.js               # Root layout + Google Fonts
├── page.js                 # / → Splash screen
├── globals.css             # Design tokens, blobs, all styles
├── components/
│   ├── GoogleIcon.js       # Google SVG icon
│   └── FacebookIcon.js     # Facebook SVG icon
├── login/
│   └── page.js             # /login
└── register/
    └── page.js             # /register
```

## Design Details

- **Fonts**: Cormorant Garamond (logo/headings) + DM Sans (body)
- **Organic blob shapes**: CSS `border-radius` with asymmetric % values
- **Login button**: Black pill (`border-radius: 10px`)
- **Register button**: Blue rounded pill (`border-radius: 100px`, `#2b2be0`)
- **Social buttons**: Google (white + border) & Facebook (brand blue)
- **Animations**: Staggered `fadeUp` on page load

## Connecting a Backend

Replace the `setTimeout` in `handleSubmit` with your API call:

```js
// login
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})

// register
const res = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
})
```
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> c3e1ecab3ac68cda83be6f00c07bdea5e3a253ff
