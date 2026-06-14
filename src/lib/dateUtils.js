import { PIXELS_PER_DAY, TIMELINE_PADDING_DAYS } from './ganttConfig';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function diffInDays(a, b) {
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bMid - aMid) / MS_PER_DAY);
}

export function dateToX(date, rangeStart) {
  return diffInDays(rangeStart, date) * PIXELS_PER_DAY;
}

export function xToDate(x, rangeStart) {
  const days = Math.round(x / PIXELS_PER_DAY);
  return addDays(rangeStart, days);
}

// Computes the visible date range for a Gantt chart: spans every phase that
// has dates set, always includes today, and adds padding on both ends.
export function getProjectDateRange(phases) {
  const today = getToday();
  const dated = phases.filter((p) => p.startDate && p.endDate);

  let minStart;
  let maxEnd;

  if (dated.length > 0) {
    minStart = parseISODate(dated[0].startDate);
    maxEnd = parseISODate(dated[0].endDate);
    for (const p of dated) {
      const s = parseISODate(p.startDate);
      const e = parseISODate(p.endDate);
      if (s < minStart) minStart = s;
      if (e > maxEnd) maxEnd = e;
    }
    if (today < minStart) minStart = today;
    if (today > maxEnd) maxEnd = today;
  } else {
    minStart = addDays(today, -15);
    maxEnd = addDays(today, 15);
  }

  return {
    start: addDays(minStart, -TIMELINE_PADDING_DAYS),
    end: addDays(maxEnd, TIMELINE_PADDING_DAYS),
  };
}

// Returns one marker per calendar month covered by the range, each with its
// pixel offset (clamped to 0) and a "MMM YYYY" label, for header labels and
// gridlines.
export function getMonthMarkers(range) {
  const markers = [];
  let cursor = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
  while (cursor <= range.end) {
    markers.push({
      x: Math.max(0, dateToX(cursor, range.start)),
      label: cursor.toLocaleString('default', { month: 'short', year: 'numeric' }),
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return markers;
}

// Returns a status label for a phase relative to today, or null if the
// phase has no dates set yet.
export function getPhaseStatus(phase, today = getToday()) {
  if (!phase.startDate || !phase.endDate) return null;
  if (phase.percentComplete >= 100) {
    return { label: 'Completed', overdue: false };
  }
  const end = parseISODate(phase.endDate);
  const days = diffInDays(today, end);
  if (days > 0) {
    return { label: `${days} day${days === 1 ? '' : 's'} left`, overdue: false };
  }
  if (days === 0) {
    return { label: 'Due today', overdue: false };
  }
  return { label: `${-days} day${-days === 1 ? '' : 's'} overdue`, overdue: true };
}

// Ensures endDate stays after startDate (used when a date input is edited
// directly, as opposed to dragging which already enforces ordering).
export function clampDateRange(startDate, endDate) {
  if (startDate && endDate && parseISODate(startDate) >= parseISODate(endDate)) {
    return { startDate, endDate: toISODate(addDays(parseISODate(startDate), 1)) };
  }
  return { startDate, endDate };
}
