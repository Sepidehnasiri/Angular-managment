import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, NewBooking } from '../models/booking.model';

const API_BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  getBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${API_BASE}/bookings`, {
      params: { userId },
    });
  }

  createBooking(booking: NewBooking): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE}/bookings`, booking);
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${API_BASE}/bookings/${id}`, {
      status: 'cancelled',
    });
  }

  /** Simple client-side reference number generator, e.g. BK482913 */
  generateReferenceNumber(): string {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `BK${num}`;
  }
}
