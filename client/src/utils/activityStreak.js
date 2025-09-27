// src/utils/activityStreak.js
// Input: array of ISO date strings (UTC or local ISO), returns consecutive-day streak ending today (IST/local).
export function computeStreak(datesArray = []) {
  if (!datesArray || datesArray.length === 0) return 0;

  // Normalize to local date strings (YYYY-MM-DD)
  const dateSet = new Set(
    datesArray
      .map(d => {
        if (!d) return null;
        const dt = new Date(d);
        // Convert to local date string
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      })
      .filter(Boolean)
  );

  // count consecutive days ending today
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // local midnight

  while (true) {
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, '0');
    const dd = String(cursor.getDate()).padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;
    if (dateSet.has(key)) {
      streak += 1;
      // move cursor back 1 day
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
