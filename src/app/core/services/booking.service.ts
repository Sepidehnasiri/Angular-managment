import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, NewBooking } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  getBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiBaseUrl}/bookings`, {
      params: { userId },
    });
  }

  createBooking(booking: NewBooking): Observable<Booking> {
    return this.http.post<Booking>(`${environment.apiBaseUrl}/bookings`, booking);
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(
      `${environment.apiBaseUrl}/bookings/${id}`,
      {
        status: 'cancelled',
      }
    );
  }

  /** Simple client-side reference number generator, e.g. BK482913 */
  generateReferenceNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    return `BK${timestamp}${random}`;
  }
}
