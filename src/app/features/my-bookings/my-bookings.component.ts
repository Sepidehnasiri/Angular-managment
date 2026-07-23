import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BookingService } from '../../core/services/booking.service';
import { UserService } from '../../core/services/user.service';
import { Booking } from '../../core/models/booking.model';
import {
  ConfirmDialogComponent,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { isBeforeToday, isTodayOrFuture } from '../../core/utils/date-utils';

type BookingFilter = 'upcoming' | 'past';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  filter = signal<BookingFilter>('upcoming');
  cancellingId = signal<string | null>(null);

  filteredBookings = computed(() => {
    return this.bookings().filter((b) => {
      return this.filter() === 'upcoming'
        ? isTodayOrFuture(b.eventDate)
        : isBeforeToday(b.eventDate);
    });
  });

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookingService.getBookings(this.userService.userId).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'Could not load your bookings. Make sure the json-server backend is running (npm run server).'
        );
        this.loading.set(false);
      },
    });
  }

  totalTickets(booking: Booking): number {
    return booking.tickets.reduce((sum, t) => sum + t.quantity, 0);
  }

  emptyMessage(): string {
    if (this.bookings().length === 0) {
      return 'No bookings yet.';
    }
    return this.filter() === 'upcoming'
      ? 'No upcoming bookings.'
      : 'No past bookings.';
  }

  canCancelBooking(booking: Booking): boolean {
    return booking.status === 'confirmed' && isTodayOrFuture(booking.eventDate);
  }

  cancelBooking(booking: Booking): void {
    if (!this.canCancelBooking(booking) || this.cancellingId() === booking.id) {
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel booking?',
        message: `This will cancel your booking for "${booking.eventTitle}" (${booking.referenceNumber}). This cannot be undone.`,
        confirmLabel: 'Cancel booking',
        cancelLabel: 'Keep booking',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.cancellingId.set(booking.id);
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: (updated) => {
          this.bookings.update((list) =>
            list.map((b) => (b.id === updated.id ? updated : b))
          );
          this.cancellingId.set(null);
          this.snackBar.open('Booking cancelled.', 'Dismiss', { duration: 4000 });
        },
        error: () => {
          this.cancellingId.set(null);
          this.snackBar.open('Could not cancel booking. Please try again.', 'Dismiss', {
            duration: 4000,
          });
        },
      });
    });
  }
}
