import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));

// The module memoizes GA initialization, so each test gets a fresh copy.
const load = async () => {
  vi.resetModules();
  const ReactGA = (await import('react-ga4')).default;
  const analytics = await import('./analytics');
  return { ReactGA: vi.mocked(ReactGA), ...analytics };
};

beforeEach(() => {
  // The react-ga4 mock survives resetModules; reset its call history.
  vi.clearAllMocks();
  vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
    cb();
    return 0;
  });
});

describe('parseTrackAttribute', () => {
  test('splits Category|Action|Label', async () => {
    const { parseTrackAttribute } = await load();
    expect(parseTrackAttribute('Project|Click|Yutori')).toEqual({
      category: 'Project',
      action: 'Click',
      label: 'Yutori',
    });
  });

  test('label is optional and may itself contain a pipe', async () => {
    const { parseTrackAttribute } = await load();
    expect(parseTrackAttribute('Contact|Click Email')).toEqual({
      category: 'Contact',
      action: 'Click Email',
    });
    expect(parseTrackAttribute('Project|Click|A|B')?.label).toBe('A|B');
  });

  test('rejects missing or malformed values', async () => {
    const { parseTrackAttribute } = await load();
    expect(parseTrackAttribute(null)).toBeNull();
    expect(parseTrackAttribute('')).toBeNull();
    expect(parseTrackAttribute('OnlyCategory')).toBeNull();
  });
});

describe('GA lifecycle (no consent gate)', () => {
  test('initializes once, without GA’s automatic page_view', async () => {
    const { ReactGA, startAnalytics } = await load();
    await startAnalytics();
    await startAnalytics();
    expect(ReactGA.initialize).toHaveBeenCalledTimes(1);
    expect(ReactGA.initialize).toHaveBeenCalledWith('G-TEST', {
      gtagOptions: { send_page_view: false },
    });
  });

  test('a pageview is sent only after GA has initialized', async () => {
    const pending: (() => void)[] = [];
    vi.stubGlobal('requestIdleCallback', (cb: () => void) => pending.push(cb));
    const { ReactGA, trackPageview } = await load();

    trackPageview('/profile/recruiter');
    await Promise.resolve();
    expect(ReactGA.send).not.toHaveBeenCalled();

    pending.forEach((cb) => cb());
    await vi.waitFor(() =>
      expect(ReactGA.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/profile/recruiter' }),
    );
    expect(ReactGA.initialize).toHaveBeenCalledBefore(ReactGA.send);
  });
});

describe('handleTrackClick', () => {
  test('reports the nearest [data-track] ancestor of the click target', async () => {
    const { ReactGA, handleTrackClick } = await load();
    document.body.innerHTML =
      '<a data-track="Project|Click|Yutori"><span id="inner">Yutori</span></a>';

    handleTrackClick({ target: document.getElementById('inner') } as unknown as Event);

    await vi.waitFor(() =>
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: 'Project',
        action: 'Click',
        label: 'Yutori',
      }),
    );
  });

  test('ignores clicks outside any tracked element', async () => {
    const { ReactGA, handleTrackClick } = await load();
    document.body.innerHTML = '<p id="plain">text</p>';

    handleTrackClick({ target: document.getElementById('plain') } as unknown as Event);
    await new Promise((r) => setTimeout(r, 0));

    expect(ReactGA.event).not.toHaveBeenCalled();
  });
});
