import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'emp-favorites';

/** Tracks favorited/liked event ids, persisted to localStorage. */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly favoriteIds = signal<Set<string>>(this.readInitial());

  isFavorite(eventId: string): boolean {
    return this.favoriteIds().has(eventId);
  }

  toggle(eventId: string): void {
    const next = new Set(this.favoriteIds());
    if (next.has(eventId)) {
      next.delete(eventId);
    } else {
      next.add(eventId);
    }
    this.favoriteIds.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }

  private readInitial(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }
}
