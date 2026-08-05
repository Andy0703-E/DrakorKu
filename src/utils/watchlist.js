const STORAGE_KEY = 'drakorku:my-list';

export function getWatchlist() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const items = stored ? JSON.parse(stored) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function isSaved(id) {
  return getWatchlist().some((item) => String(item.id) === String(id));
}

export function toggleWatchlist(item) {
  const items = getWatchlist();
  const exists = items.some((entry) => String(entry.id) === String(item.id));
  const nextItems = exists
    ? items.filter((entry) => String(entry.id) !== String(item.id))
    : [{
        id: item.id,
        title: item.title,
        image: item.image || item.thumb || '',
        category: item.category || '',
        tipe: item.tipe || '',
        date: item.date || '',
      }, ...items];

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event('watchlist:changed'));
  } catch {
    // The catalogue remains usable if local browser storage is unavailable.
  }

  return !exists;
}
