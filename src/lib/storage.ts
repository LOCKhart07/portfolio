// localStorage that never throws. Private browsing, blocked site data and
// some locked-down browsers make getItem/setItem throw; for preferences like
// "nudge dismissed" that should just mean "behave like a first visit".
export const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the preference just isn't remembered */
  }
};
