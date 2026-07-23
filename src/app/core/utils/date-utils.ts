export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isTodayOrFuture(dateString: string): boolean {
  return parseLocalDate(dateString).getTime() >= startOfToday().getTime();
}

export function isBeforeToday(dateString: string): boolean {
  return parseLocalDate(dateString).getTime() < startOfToday().getTime();
}

export function isWithinNextDays(dateString: string, days: number): boolean {
  const date = parseLocalDate(dateString);
  const today = startOfToday();
  const end = new Date(today);
  end.setDate(today.getDate() + days);
  return date >= today && date <= end;
}

export function isInCurrentMonth(dateString: string): boolean {
  const date = parseLocalDate(dateString);
  const today = startOfToday();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
}

export function compareDateStrings(a: string, b: string): number {
  return parseLocalDate(a).getTime() - parseLocalDate(b).getTime();
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
