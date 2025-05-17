import { Timestamp } from 'firebase-admin/firestore';

/**
 * Check if a value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if a value is a Timestamp
 */
export function isTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

/**
 * Convert a Date to ISO string format
 */
export function dateToString(date: Date): string {
  return date.toISOString();
}

/**
 * Safely parse a date string
 */
export function parseDate(dateStr: string): Date | null {
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime()) ? parsed : null;
}
