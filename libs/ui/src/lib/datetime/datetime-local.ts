export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function parseDateTimeLocal(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTimeLocal(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function resolveMinDate(options: {
  blockPastDates: boolean;
  floor?: Date | null;
}): Date | null {
  const today = options.blockPastDates ? startOfToday() : null;
  const floor = options.floor ?? null;

  if (today && floor) {
    return floor > today ? floor : today;
  }

  return floor ?? today;
}

export function isBeforeToday(value: string): boolean {
  const date = parseDateTimeLocal(value);
  if (!date) {
    return false;
  }

  return date < startOfToday();
}
