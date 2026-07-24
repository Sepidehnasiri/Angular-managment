# Event Management Platform

GitHub repository: https://github.com/Sepidehnasiri/Angular-managment

Live frontend URL: https://angular-managment.vercel.app/

Live backend URL: https://angular-managment-project.onrender.com

Angular Event Management Platform for the Hands on Project 1 assignment. Users can browse events, view event details, book tickets through a three-step flow, manage bookings, cancel eligible bookings, view a simple profile page, and switch between light and dark themes.

## Features

- Events card grid with title, date, location, starting price, category, image, and favorite icon
- Search by event title
- Category, date, and price filters
- Sorting by date or price
- Event details with description, date, time, venue/location, organizer, ticket types, and Book Tickets button
- Three-step booking flow with dynamic `Step X of 3` progress text
- Attendee forms for each selected ticket with name, email, and phone validation
- Booking confirmation with generated reference number and View My Bookings navigation
- My Bookings page with upcoming/past filters, status, ticket totals, total amount, and cancellation
- Confirmation dialog before cancellation
- Light/dark theme toggle in the header
- Theme and favorites persisted in `localStorage`
- Loading, API error, empty, and success states
- Responsive desktop, tablet, and mobile layouts
- SPA routing for Events, Event Details, Booking, My Bookings, and Profile

## Technology Stack

- Angular 18 standalone components
- Angular Router
- Angular Reactive Forms and template-driven forms
- Angular Material
- RxJS
- JSON Server 0.17.4 mock backend
- Vercel for Angular frontend hosting
- Render for JSON Server backend hosting

## Prerequisites

- Node.js 18 or newer
- npm

## Local Setup

```bash
npm install
```

Run Angular and JSON Server together:

```bash
npm run dev
```

Run them separately:

```bash
npm run server
npm run start
```

Local frontend:

```text
http://localhost:4200
```

Local backend:

```text
http://localhost:3000
```

## Build And Test

Production build:

```bash
npm run build
```

Non-interactive tests:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Angular production output directory:

```text
dist/event-management-platform/browser
```

## API Configuration

Local development API URL:

```text
http://localhost:3000
```

Production API URL (configured in `src/environments/environment.prod.ts`):

```text
https://angular-managment-project.onrender.com
```

Do not edit individual services for deployment. Event and booking services both read the shared Angular environment configuration.

## Required API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/events` | Fetch all events |
| GET | `/events/:id` | Fetch a single event |
| GET | `/bookings?userId=...` | Fetch bookings for the current user |
| POST | `/bookings` | Create a booking |
| PATCH | `/bookings/:id` | Update booking status for cancellation |

## Render Backend Deployment

The JSON Server backend is deployed on Render.

Render settings used:

```text
Service type: Web Service
Root directory: repository root
Build command: npm install
Start command: npm run server:prod
```

The production backend script runs:

```bash
node server.cjs
```

`server.cjs` serves `db.json`, binds to `0.0.0.0`, and uses Render's `PORT` environment variable with a local fallback to `3000`.

## Vercel Frontend Deployment

The Angular frontend is deployed on Vercel, built against the Render backend URL configured in `environment.prod.ts`.

Vercel settings used:

```text
Framework preset: Angular
Root directory: repository root
Build command: npm run build
Output directory: dist/event-management-platform/browser
Install command: npm install
```

The included `vercel.json` rewrites all frontend routes to `index.html` so refreshes work for:

```text
/events
/events/1
/events/1/book
/my-bookings
/profile
```

API requests are not rewritten to Vercel. The Angular app calls the Render backend URL configured in `environment.prod.ts`.

## Project Structure

```text
src/app/
  core/
    models/       Event and booking interfaces
    services/     API, user, theme, and favorites services
    utils/        Shared local-date helpers
  shared/
    components/   Header and confirmation dialog
  features/
    booking/      Three-step ticket booking flow
    events/       Events list and event details
    my-bookings/  Booking management page
    profile/      Simple assignment profile page
src/environments/ Angular API configuration
server.cjs        Render-compatible JSON Server entry point
vercel.json       Vercel SPA fallback routing
```

## Known Limitations

- Authentication is not part of the assignment, so the app uses a fixed mock user: `user1`.
- Filtering is client-side after fetching `/events`, which is acceptable for this assignment-sized JSON Server dataset.
- Ticket availability is validated in the form but not decremented in `db.json` after booking.
- Render's filesystem is ephemeral on many service types. Bookings created through hosted JSON Server may be temporary and can disappear after restarts or redeployments.
