import { test, expect, describe } from 'vitest';
import {
  PERSONAS,
  isPersona,
  coercePersona,
  imageMap,
  topPicksConfig,
  continueWatchingConfig,
} from './personaConfig';

describe('isPersona', () => {
  test('accepts exactly the four real personas', () => {
    expect(PERSONAS.every(isPersona)).toBe(true);
  });

  test('rejects unknown / empty / undefined', () => {
    expect(isPersona('foobar')).toBe(false);
    expect(isPersona('')).toBe(false);
    expect(isPersona(undefined)).toBe(false);
    // case-sensitive: the URL segment is lowercase by contract
    expect(isPersona('Recruiter')).toBe(false);
  });
});

describe('coercePersona', () => {
  test('passes a valid persona through unchanged', () => {
    expect(coercePersona('developer')).toBe('developer');
    expect(coercePersona('adventurer')).toBe('adventurer');
  });

  test('falls back to recruiter for anything invalid', () => {
    expect(coercePersona('foobar')).toBe('recruiter');
    expect(coercePersona(undefined)).toBe('recruiter');
    expect(coercePersona('')).toBe('recruiter');
  });
});

describe('config invariants', () => {
  // Every card title rendered by these rows looks up imageMap for its <img
  // src>. A title without an entry ships a broken image — guard it here so a
  // future config edit fails the suite instead of production.
  test('every topPicks / continueWatching title has an image', () => {
    const titles = [
      ...Object.values(topPicksConfig).flat().map((p) => p.title),
      ...Object.values(continueWatchingConfig).flat().map((p) => p.title),
    ];
    const missing = titles.filter((t) => !imageMap[t]);
    expect(missing).toEqual([]);
  });
});
