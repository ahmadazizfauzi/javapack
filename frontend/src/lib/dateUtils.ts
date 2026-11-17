/**
 * Indonesian Western Time (WIB / UTC+7) Date & Time Utilities.
 *
 * CRITICAL RULE:
 * Database (MySQL / VPS) and Backend API already store and return timestamps natively in WIB.
 * NEVER manually add +7 hours (+ 7 * 3600 * 1000) or manipulate timestamps manually,
 * as doing so will cause double timezone addition (+7 counted twice).
 */

function toValidDate(date: Date | string | number | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof date === 'string') {
    // If the string is a raw MySQL timestamp format ("YYYY-MM-DD HH:mm:ss") without timezone offset,
    // ensure it is parsed as WIB (+07:00) without manual arithmetic additions.
    const normalized = date.includes('T') || date.includes('+') || date.endsWith('Z')
      ? date
      : `${date.replace(' ', 'T')}+07:00`;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? new Date(date) : d;
  }

  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format jam dalam WIB (contoh: "14:30" atau "14:30 WIB").
 */
export function formatTimeWib(
  date: Date | string | number | null | undefined,
  includeWib = false
): string {
  const d = toValidDate(date);
  if (!d) return '-';

  const formatted = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d).replace('.', ':');

  return includeWib ? `${formatted} WIB` : formatted;
}

/**
 * Format tanggal dan bulan (contoh: "27 November 2026").
 */
export function formatDateWib(
  date: Date | string | number | null | undefined
): string {
  const d = toValidDate(date);
  if (!d) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Format hari, tanggal, dan bulan (contoh: "Kamis, 27 November 2026").
 */
export function formatDayDateWib(
  date: Date | string | number | null | undefined
): string {
  const d = toValidDate(date);
  if (!d) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Format lengkap hari, tanggal, bulan, dan jam (contoh: "Kamis, 27 November 2026, 14:30 WIB").
 */
export function formatFullDateWib(
  date: Date | string | number | null | undefined
): string {
  const d = toValidDate(date);
  if (!d) return '-';

  const dayDate = formatDayDateWib(d);
  const time = formatTimeWib(d);
  return `${dayDate}, ${time} WIB`;
}

/**
 * Format tanggal ringkas (contoh: "27/11/2026").
 */
export function formatShortDateWib(
  date: Date | string | number | null | undefined
): string {
  const d = toValidDate(date);
  if (!d) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}
