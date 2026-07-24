export interface AvailabilitySlot {
  day: string;
  slots: string[];
}

export interface AvailabilityGrid {
  timezone: string;
  weekly: AvailabilitySlot[];
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const DEFAULT_AVAILABILITY: AvailabilityGrid = {
  timezone: 'local',
  weekly: [
    { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    { day: 'Tuesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    { day: 'Thursday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    { day: 'Saturday', slots: ['10:00', '11:00', '12:00'] },
    { day: 'Sunday', slots: [] },
  ],
};

export function parseAvailability(gridJson: string): AvailabilityGrid {
  try {
    const parsed = JSON.parse(gridJson) as AvailabilityGrid;
    if (parsed && Array.isArray(parsed.weekly)) return parsed;
  } catch {
    /* fall through */
  }
  return DEFAULT_AVAILABILITY;
}

export function dayNameFromDate(date: Date): string {
  const jsDay = date.getDay();
  const map: Record<number, string> = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  return map[jsDay];
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}
