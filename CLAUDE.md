# AUTOMYCKA KARLIN

## Project Overview
Car wash website for "Automycka Karlin" in Prague Karlin district.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 with custom @theme tokens
- shadcn/ui components
- Zustand for booking state
- Embla Carousel for carousels
- Framer Motion for animations

## Design Tokens
- Brand Black: #302e2f
- Brand White: #f0eff0
- Brand Purple: #7960a9
- Brand Purple Light: #9b7ec4
- Brand Gray: #b1b3b6
- Font: Clash Display (Regular 400, Medium 500, Semibold 600, Bold 700)
- Container: max-w-[1536px] mx-auto px-8

## Key Directories
- src/app/(frontend)/ -- Public website pages
- src/app/(frontend)/rezervace/ -- Booking flow
- src/components/home/ -- Home page sections
- src/components/layout/ -- Header, Footer
- src/components/ui/ -- shadcn/ui components
- src/stores/ -- Zustand stores
- src/lib/altegio/ -- Altegio API integration

## Commands
- npm run dev -- Start dev server
- npm run build -- Production build
- npm run start -- Start production server
- pm2 start ecosystem.config.js --env production -- Deploy with PM2

## Figma
- File key: 5OKoh6a9PGrT6j0gPKbw0s
- Desktop: 1920px width
- Mobile: 390px width

## Language
All content is in Czech (cs). Lang attribute is set to "cs".
