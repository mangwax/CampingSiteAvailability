# BC Campsite Availability Dashboard

A web dashboard for checking BC Parks and private campsite availability in British Columbia, with email notification support.

## Features

- **Dashboard** – browse all BC Parks and private campsites with real-time availability status
- **Search & Filter** – filter by campsite type, availability, region, and amenities
- **Stats Bar** – at-a-glance summary of available/limited/full parks and total sites
- **Availability Alerts** – set up email notifications when sites open up for your chosen dates
- **Responsive UI** – works on mobile, tablet and desktop

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Data Sources

Campsite data is currently served from a static dataset (`src/data/campsites.ts`) that mirrors the structure of [BC Parks Discover Camping](https://www.discovercamping.ca/) and representative private campground listings. Replace the data layer with live API calls as availability APIs become accessible.
