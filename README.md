# Event Management Platform

Angular (standalone components) event browsing, ticket booking, and booking management app, built against the "Hands on Project 1" spec. Uses Angular Material for UI and `json-server` as a mock local backend.

## Features

- **Events listing** — card grid, search by title, filters (category, date, price), sort (date/price), favorite/like icon (persisted to `localStorage`)
- **Event details** — full event info, ticket types & pricing, Book Tickets CTA
- **Ticket booking** — 3-step flow (select tickets → attendee details → confirmation) using `MatStepper`, live price calculation, validation, back navigation, booking reference number
- **My Bookings** — list with upcoming/past filter, cancel with confirmation dialog, success notifications
- **Theme toggle** — light/dark mode, persisted to `localStorage`, applied app-wide
- **UX** — loading spinners, error states, empty states, responsive layout

## Prerequisites

- Node.js 18+ and npm
- Angular CLI (optional globally, or use `npx ng`)

## Install

```
npm install
```

## Run

This runs the Angular dev server and the `json-server` mock API together:

```
npm run dev
```

- App: http://localhost:4200
- API: http://localhost:3000

Or run them separately:

```
npm run server   # json-server on :3000, watching db.json
npm run start    # ng serve on :4200
```

## Mock user

The spec has no auth flow, so the app uses a fixed mock user (`userId: 'user1'`), matching `db.json`.

## API (json-server)

| Method | Endpoint             | Description                          |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/events`              | Fetch all events (optional `?category=`) |
| GET    | `/events/:id`          | Fetch a single event                  |
| GET    | `/bookings?userId=...` | Fetch bookings for a user             |
| POST   | `/bookings`            | Create a booking                      |
| PATCH  | `/bookings/:id`        | Update booking status (cancellation)  |

## Project structure

```
src/app/
  core/
    models/       Event, Booking types
    services/     EventService, BookingService, ThemeService, UserService, FavoritesService
  shared/
    components/   Header (nav + theme toggle), ConfirmDialog
  features/
    events/       EventsListComponent, EventDetailsComponent
    booking/      BookingFlowComponent (3-step MatStepper)
    my-bookings/  MyBookingsComponent
```

## Git

This project was scaffolded without a live shell, so git wasn't run automatically. Repo: https://github.com/Sepidehnasiri/Angular-managment

1. Create that repo on GitHub first (empty, no README/gitignore) if it doesn't exist yet: https://github.com/new
2. From this folder, run:

```
scripts\setup-git.ps1
```

This initializes the repo, creates one commit per feature area (matching how the project was built), sets the remote to `Angular-managment`, and pushes `main`. Pass `-RemoteUrl` to target a different repo. See `scripts/setup-git.ps1` for the exact commands if you'd rather run them manually.
