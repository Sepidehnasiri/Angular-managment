export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
}

export interface EventModel {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO date, e.g. 2025-07-15
  time: string;
  location: string;
  venue: string;
  image: string;
  organizerName: string;
  ticketTypes: TicketType[];
}

export type DateFilter = 'all' | 'upcoming' | 'this-week' | 'this-month';
export type PriceFilter = 'all' | 'free' | 'under-50' | '50-plus';
export type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';

export interface EventFilters {
  search: string;
  category: string;
  dateFilter: DateFilter;
  priceFilter: PriceFilter;
  sort: SortOption;
}
