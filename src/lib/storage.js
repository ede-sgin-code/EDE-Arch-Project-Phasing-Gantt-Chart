import { createSeedData } from './seedData';

const STORAGE_KEY = 'arch-gantt-data';

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.projects)) return parsed;
    }
  } catch {
    // fall through to seed data below
  }
  const seeded = createSeedData();
  saveData(seeded);
  return seeded;
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetToDemoData() {
  const seeded = createSeedData();
  saveData(seeded);
  return seeded;
}
