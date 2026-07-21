export interface Attendee {
  name: string;
  email: string;
  phone: string;
}

export interface BookedTicket {
  type: string;
  quantity: number;
  price: number;
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  tickets: BookedTicket[];
  attendees: Attendee[];
  totalAmount: number;
  status: BookingStatus;
  bookingDate: string;
  referenceNumber: string;
}

/** Payload used when creating a new booking (id/status/reference are server/client generated). */
export type NewBooking = Omit<Booking, 'id'>;
