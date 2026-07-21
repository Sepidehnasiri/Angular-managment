import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EventService } from '../../../core/services/event.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import {
  DateFilter,
  EventModel,
  PriceFilter,
  SortOption,
} from '../../../core/models/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss',
})
export class EventsListComponent implements OnInit {
  events = signal<EventModel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  search = signal('');
  category = signal('all');
  dateFilter = signal<DateFilter>('all');
  priceFilter = signal<PriceFilter>('all');
  sort = signal<SortOption>('date-asc');

  categories = computed(() => {
    const set = new Set(this.events().map((e) => e.category));
    return ['all', ...Array.from(set).sort()];
  });

  filteredEvents = computed(() => {
    let list = [...this.events()];
    const search = this.search().trim().toLowerCase();
    if (search) {
      list = list.filter((e) => e.title.toLowerCase().includes(search));
    }

    if (this.category() !== 'all') {
      list = list.filter((e) => e.category === this.category());
    }

    list = list.filter((e) => this.matchesDateFilter(e, this.dateFilter()));
    list = list.filter((e) => this.matchesPriceFilter(e, this.priceFilter()));

    list = this.applySort(list, this.sort());
    return list;
  });

  constructor(
    private eventService: EventService,
    public favorites: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.error.set(null);
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'Could not load events. Make sure the json-server backend is running (npm run server).'
        );
        this.loading.set(false);
      },
    });
  }

  minPrice(event: EventModel): number {
    if (!event.ticketTypes?.length) return 0;
    return Math.min(...event.ticketTypes.map((t) => t.price));
  }

  toggleFavorite(eventId: string, evt: Event): void {
    evt.stopPropagation();
    evt.preventDefault();
    this.favorites.toggle(eventId);
  }

  private matchesDateFilter(event: EventModel, filter: DateFilter): boolean {
    if (filter === 'all') return true;
    const eventDate = new Date(event.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return eventDate.getTime() >= now.getTime();
    }
    if (filter === 'this-week') {
      const weekFromNow = new Date(now);
      weekFromNow.setDate(now.getDate() + 7);
      return eventDate >= now && eventDate <= weekFromNow;
    }
    if (filter === 'this-month') {
      return (
        eventDate.getFullYear() === now.getFullYear() &&
        eventDate.getMonth() === now.getMonth()
      );
    }
    return true;
  }

  private matchesPriceFilter(event: EventModel, filter: PriceFilter): boolean {
    if (filter === 'all') return true;
    const min = this.minPrice(event);
    if (filter === 'free') return min === 0;
    if (filter === 'under-50') return min > 0 && min < 50;
    if (filter === '50-plus') return min >= 50;
    return true;
  }

  private applySort(list: EventModel[], sort: SortOption): EventModel[] {
    const sorted = [...list];
    switch (sort) {
      case 'date-asc':
        return sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case 'date-desc':
        return sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'price-asc':
        return sorted.sort((a, b) => this.minPrice(a) - this.minPrice(b));
      case 'price-desc':
        return sorted.sort((a, b) => this.minPrice(b) - this.minPrice(a));
      default:
        return sorted;
    }
  }
}
