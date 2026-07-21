import { Injectable } from '@angular/core';

/**
 * The project spec has no authentication flow, so we use a fixed mock user
 * (matches the sample data in the requirements doc, e.g. bookings.userId === 'user1').
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  readonly userId = 'user1';
  readonly displayName = 'John Doe';
}
