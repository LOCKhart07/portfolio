import { test, expect, describe } from 'vitest';
import {
  PERSONAS,
  ProfileType,
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
    expect(coercePersona('engineer')).toBe('engineer');
    expect(coercePersona('explorer')).toBe('explorer');
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

  // The product rule: picking a persona reorders sections, it never hides
  // them. So every persona's two rows must cover the SAME full set — and a
  // section must not appear twice for one persona (it'd render a dup card).
  const sectionsFor = (p: ProfileType) => [
    ...topPicksConfig[p].map((t) => t.title),
    ...continueWatchingConfig[p].map((c) => c.title),
  ];

  test('no persona hides a section another persona shows', () => {
    const fullSet = [
      ...new Set(PERSONAS.flatMap(sectionsFor)),
    ].sort();
    for (const p of PERSONAS) {
      expect([...new Set(sectionsFor(p))].sort()).toEqual(fullSet);
    }
  });

  test('a section is never duplicated within one persona', () => {
    for (const p of PERSONAS) {
      const titles = sectionsFor(p);
      expect(titles.length).toBe(new Set(titles).size);
    }
  });
});
