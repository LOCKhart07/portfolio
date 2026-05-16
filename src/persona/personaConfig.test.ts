import { test, expect, describe } from 'vitest';
import {
  PERSONAS,
  isPersona,
  coercePersona,
  orderByPriority,
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

describe('orderByPriority', () => {
  const items = [
    { name: 'a', tech: 'Java, Spring' },
    { name: 'b', tech: 'React, Node' },
    { name: 'c', tech: 'Python, FastAPI' },
    { name: 'd', tech: 'React, Python' },
  ];

  test('no priority tags => original order, same reference', () => {
    expect(orderByPriority(items, (i) => i.tech)).toBe(items);
    expect(orderByPriority(items, (i) => i.tech, []).map((i) => i.name)).toEqual([
      'a', 'b', 'c', 'd',
    ]);
  });

  test('matching items bubble up, both groups keep relative order (stable)', () => {
    // b and d match "React"; a and c do not. Within each group the original
    // order (b before d, a before c) must be preserved.
    const out = orderByPriority(items, (i) => i.tech, ['React']).map((i) => i.name);
    expect(out).toEqual(['b', 'd', 'a', 'c']);
  });

  test('match is case-insensitive substring', () => {
    const out = orderByPriority(items, (i) => i.tech, ['python']).map((i) => i.name);
    // c and d contain "Python"; order among them preserved (c before d).
    expect(out).toEqual(['c', 'd', 'a', 'b']);
  });

  test('no match leaves order untouched', () => {
    const out = orderByPriority(items, (i) => i.tech, ['rust']).map((i) => i.name);
    expect(out).toEqual(['a', 'b', 'c', 'd']);
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
