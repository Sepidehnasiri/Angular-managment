import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EventService } from '../../../core/services/event.service';
import { BookingService } from '../../../core/services/booking.service';
import { UserService } from '../../../core/services/user.service';
import { EventModel } from '../../../core/models/event.model';
import { NewBooking } from '../../../core/models/booking.model';
import { formatLocalDate } from '../../../core/utils/date-utils';

/** Validator: at least one ticket must be selected across all ticket types. */
function atLeastOneTicketValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const values = Object.values(group.value ?? {}) as number[];
    const total = values.reduce((sum, v) => sum + (Number(v) || 0), 0);
    return total > 0 ? null : { noTickets: true };
  };
}

@Component({
  selector: 'app-booking-flow',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './booking-flow.component.html',
  styleUrl: './booking-flow.component.scss',
})
export class BookingFlowComponent implements OnInit {
  event = signal<EventModel | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  bookingReference = signal<string | null>(null);
  submitError = signal<string | null>(null);

  ticketsForm!: FormGroup;
  attendeesForm: FormGroup = this.fb.group({ attendees: this.fb.array([]) });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventService: EventService,
    private bookingService: BookingService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!id) {
      this.error.set('Missing event id.');
      this.loading.set(false);
      return;
    }
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.buildTicketsForm(event);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load this event.');
        this.loading.set(false);
      },
    });
  }

  get attendeeControls(): FormArray {
    return this.attendeesForm.get('attendees') as FormArray;
  }

  private buildTicketsForm(event: EventModel): void {
    const group: Record<string, AbstractControl> = {};
    for (const t of event.ticketTypes) {
      group[t.id] = this.fb.control(0, [Validators.min(0), Validators.max(t.available)]);
    }
    this.ticketsForm = this.fb.group(group, { validators: atLeastOneTicketValidator() });
  }

  totalTicketCount(): number {
    if (!this.ticketsForm) return 0;
    const values = Object.values(this.ticketsForm.value ?? {}) as number[];
    return values.reduce((sum, v) => sum + (Number(v) || 0), 0);
  }

  totalAmount(): number {
    const event = this.event();
    if (!event || !this.ticketsForm) return 0;
    return event.ticketTypes.reduce((sum, t) => {
      const qty = Number(this.ticketsForm.value[t.id] ?? 0);
      return sum + qty * t.price;
    }, 0);
  }

  /** Called when moving from Step 1 to Step 2: resize the attendee form array to match ticket count. */
  onTicketsStepChange(): void {
    const desired = this.totalTicketCount();
    const current = this.attendeeControls.length;

    if (desired > current) {
      for (let i = current; i < desired; i++) {
        this.attendeeControls.push(this.createAttendeeGroup());
      }
    } else if (desired < current) {
      for (let i = current; i > desired; i--) {
        this.attendeeControls.removeAt(i - 1);
      }
    }
  }

  private createAttendeeGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{7,15}$/)]],
    });
  }

  ticketBreakdown(): { name: string; qty: number; price: number; subtotal: number }[] {
    const event = this.event();
    if (!event || !this.ticketsForm) return [];
    return event.ticketTypes
      .map((t) => {
        const qty = Number(this.ticketsForm.value[t.id] ?? 0);
        return { name: t.name, qty, price: t.price, subtotal: qty * t.price };
      })
      .filter((row) => row.qty > 0);
  }

  confirmBooking(): void {
    const event = this.event();
    if (
      !event ||
      this.submitting() ||
      this.bookingReference() ||
      this.ticketsForm.invalid ||
      this.attendeesForm.invalid
    ) {
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const tickets = this.ticketBreakdown().map((row) => ({
      type: row.name,
      quantity: row.qty,
      price: row.price,
    }));

    const payload: NewBooking = {
      userId: this.userService.userId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      tickets,
      attendees: this.attendeeControls.value,
      totalAmount: this.totalAmount(),
      status: 'confirmed',
      bookingDate: formatLocalDate(new Date()),
      referenceNumber: this.bookingService.generateReferenceNumber(),
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.bookingReference.set(booking.referenceNumber);
        this.submitting.set(false);
        this.snackBar.open('Booking confirmed!', 'Dismiss', { duration: 4000 });
      },
      error: () => {
        this.submitError.set('Something went wrong while confirming your booking. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}
