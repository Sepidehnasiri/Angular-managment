import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event.model';

const API_BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  /** Fetch all events. Category can be passed as an optional json-server query param. */
  getEvents(category?: string): Observable<EventModel[]> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    return this.http.get<EventModel[]>(`${API_BASE}/events`, { params });
  }

  getEvent(id: string): Observable<EventModel> {
    return this.http.get<EventModel>(`${API_BASE}/events/${id}`);
  }
}
