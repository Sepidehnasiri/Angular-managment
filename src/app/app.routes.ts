import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'events' },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events-list/events-list.component').then(
        (m) => m.EventsListComponent
      ),
    title: 'Events',
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./features/events/event-details/event-details.component').then(
        (m) => m.EventDetailsComponent
      ),
    title: 'Event Details',
  },
  {
    path: 'events/:id/book',
    loadComponent: () =>
      import('./features/booking/booking-flow/booking-flow.component').then(
        (m) => m.BookingFlowComponent
      ),
    title: 'Book Tickets',
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./features/my-bookings/my-bookings.component').then(
        (m) => m.MyBookingsComponent
      ),
    title: 'My Bookings',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'Profile',
  },
  { path: '**', redirectTo: 'events' },
];
