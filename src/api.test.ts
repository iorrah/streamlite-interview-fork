import { describe, it, expect, vi } from 'vitest';
import { catalog, fetchContinueWatching, isContinueWatchingItem, type Show, type ContinueWatchingItem } from './api';

describe('catalog', () => {
    it('has a non-empty shows list and title for every row', () => {
        for (const [key, row] of Object.entries(catalog)) {
            expect(row.title, `catalog.${key}.title`).toBeTruthy();
            expect(row.shows.length, `catalog.${key}.shows`).toBeGreaterThan(0);
        }
    });

    it('has unique show ids across the whole catalog', () => {
        const allIds = Object.values(catalog).flatMap((row) => row.shows.map((show) => show.id));
        expect(new Set(allIds).size).toBe(allIds.length);
    });
});

describe('fetchContinueWatching', () => {
    it('resolves with the continue-watching items', async () => {
        const items = await fetchContinueWatching();

        expect(items.length).toBeGreaterThan(0);
        expect(items[0]).toMatchObject({ id: expect.any(String), title: expect.any(String) });
    });

    it('resolves with a progress value between 0 and 1 for every item', async () => {
        const items = await fetchContinueWatching();

        for (const item of items) {
            expect(item.progress).toBeGreaterThanOrEqual(0);
            expect(item.progress).toBeLessThanOrEqual(1);
        }
    });

    it('resolves after a delay rather than synchronously', () => {
        vi.useFakeTimers();

        const onResolve = vi.fn();
        fetchContinueWatching().then(onResolve);

        expect(onResolve).not.toHaveBeenCalled();

        vi.runAllTimers();

        vi.useRealTimers();
    });
});

describe('isContinueWatchingItem', () => {
    const plainShow: Show = { id: '1', title: 'Alpha', genre: 'Drama' };
    const continueWatchingItem: ContinueWatchingItem = { id: '2', title: 'Beta', genre: 'Comedy', progress: 0.5 };

    it('returns false for a plain Show without progress', () => {
        expect(isContinueWatchingItem(plainShow)).toBe(false);
    });

    it('returns true for a ContinueWatchingItem', () => {
        expect(isContinueWatchingItem(continueWatchingItem)).toBe(true);
    });

    it('returns true even when progress is 0', () => {
        const itemWithZeroProgress: ContinueWatchingItem = { ...continueWatchingItem, progress: 0 };
        expect(isContinueWatchingItem(itemWithZeroProgress)).toBe(true);
    });

    it('returns false if progress is present but not a number', () => {
        const malformed = { ...plainShow, progress: '0.5' } as unknown as Show;
        expect(isContinueWatchingItem(malformed)).toBe(false);
    });
});