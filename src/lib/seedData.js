import { getToday, addDays, toISODate } from './dateUtils';

export const DEFAULT_MAIN_PHASES = [
  { name: 'Pre-Design', color: '#94A3B8' },
  { name: 'Schematic Design', color: '#60A5FA' },
  { name: 'Design Development', color: '#34D399' },
  { name: 'Construction Documents', color: '#FBBF24' },
  { name: 'Bidding & Negotiation', color: '#F472B6' },
  { name: 'Construction Administration', color: '#A78BFA' },
];

export const SUB_PHASE_DEFAULT_COLOR = '#CBD5E1';

export function lightenColor(hex, amount = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lighten = (c) => Math.round(c + (255 - c) * amount);
  const toHex = (c) => c.toString(16).padStart(2, '0');
  return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function emptyPhase(name, color) {
  return {
    id: generateId(),
    name,
    type: 'main',
    parentId: null,
    startDate: null,
    endDate: null,
    color,
    locked: false,
    percentComplete: 0,
  };
}

export function createSubPhase(name, parentId, color = SUB_PHASE_DEFAULT_COLOR) {
  return {
    id: generateId(),
    name,
    type: 'sub',
    parentId,
    startDate: null,
    endDate: null,
    color,
    locked: false,
    percentComplete: 0,
  };
}

export function createProject(name) {
  return {
    id: generateId(),
    name,
    phases: DEFAULT_MAIN_PHASES.map((p) => emptyPhase(p.name, p.color)),
  };
}

// Builds a phase with dates expressed as day-offsets from today, so seed
// projects always look current (today-line, grey-out, etc.) regardless of
// when the app is opened.
function offsetPhase({ name, type = 'main', parentId = null, startOffset, endOffset, color, locked = false, percentComplete = 0 }) {
  const today = getToday();
  return {
    id: generateId(),
    name,
    type,
    parentId,
    startDate: toISODate(addDays(today, startOffset)),
    endDate: toISODate(addDays(today, endOffset)),
    color,
    locked,
    percentComplete,
  };
}

export function createSeedData() {
  const mapleStreet = {
    id: generateId(),
    name: 'Maple Street Residence',
    phases: [],
  };
  const preDesign = offsetPhase({ name: 'Pre-Design', startOffset: -200, endOffset: -165, color: '#94A3B8', locked: true, percentComplete: 100 });
  const sd = offsetPhase({ name: 'Schematic Design', startOffset: -165, endOffset: -110, color: '#60A5FA', locked: true, percentComplete: 100 });
  const dd = offsetPhase({ name: 'Design Development', startOffset: -110, endOffset: -50, color: '#34D399', locked: true, percentComplete: 100 });
  const cd = offsetPhase({ name: 'Construction Documents', startOffset: -50, endOffset: 20, color: '#FBBF24', percentComplete: 65 });
  const permitSet = offsetPhase({ name: 'Permit Set Submission', type: 'sub', parentId: cd.id, startOffset: -50, endOffset: -20, color: '#FDE68A', percentComplete: 100 });
  const bid = offsetPhase({ name: 'Bidding & Negotiation', startOffset: 20, endOffset: 45, color: '#F472B6' });
  const ca = offsetPhase({ name: 'Construction Administration', startOffset: 45, endOffset: 220, color: '#A78BFA' });
  mapleStreet.phases = [preDesign, sd, dd, cd, permitSet, bid, ca];

  const birchwood = {
    id: generateId(),
    name: 'Birchwood Office Renovation',
    phases: [],
  };
  birchwood.phases = [
    offsetPhase({ name: 'Pre-Design', startOffset: -10, endOffset: 20, color: '#94A3B8', percentComplete: 30 }),
    offsetPhase({ name: 'Schematic Design', startOffset: 20, endOffset: 70, color: '#60A5FA' }),
    offsetPhase({ name: 'Design Development', startOffset: 70, endOffset: 130, color: '#34D399' }),
    offsetPhase({ name: 'Construction Documents', startOffset: 130, endOffset: 180, color: '#FBBF24' }),
    offsetPhase({ name: 'Bidding & Negotiation', startOffset: 180, endOffset: 200, color: '#F472B6' }),
    offsetPhase({ name: 'Construction Administration', startOffset: 200, endOffset: 400, color: '#A78BFA' }),
  ];

  return { projects: [mapleStreet, birchwood] };
}
