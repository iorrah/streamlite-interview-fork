import { describe, it, expect } from 'vitest';
import { getBrand, getConfig } from './config';

function setUrl(search: string) {
    window.history.pushState({}, '', search);
}

describe('getBrand', () => {
    it('returns pplus by default when no brand param is present', () => {
        setUrl('/');
        expect(getBrand()).toBe('pplus');
    });

    it('returns ptv when the brand param is ptv', () => {
        setUrl('/?brand=ptv');
        expect(getBrand()).toBe('ptv');
    });

    it('returns pplus when the brand param is pplus', () => {
        setUrl('/?brand=pplus');
        expect(getBrand()).toBe('pplus');
    });

    it('falls back to pplus for an unrecognized brand value', () => {
        setUrl('/?brand=something-else');
        expect(getBrand()).toBe('pplus');
    });
});

describe('getConfig', () => {
    it('reads a top-level string value', () => {
        expect(getConfig<string>('pplus', 'brandName')).toBe('Paramount+');
        expect(getConfig<string>('ptv', 'brandName')).toBe('Pluto TV');
    });

    it('reads a nested value via dot path', () => {
        expect(getConfig<string>('pplus', 'theme.accent')).toBe('#0064ff');
        expect(getConfig<boolean>('pplus', 'features.continueWatching')).toBe(true);
        expect(getConfig<boolean>('ptv', 'features.continueWatching')).toBe(false);
    });

    it('reads an array value', () => {
        expect(getConfig<string[]>('pplus', 'home.rows')).toEqual(['trending', 'movies', 'series']);
        expect(getConfig<string[]>('ptv', 'home.rows')).toEqual(['liveTv', 'trending', 'series']);
    });

    it('returns undefined for a key that does not exist', () => {
        expect(getConfig('pplus', 'nonexistent')).toBeUndefined();
    });

    it('returns undefined for a nested path that does not exist', () => {
        expect(getConfig('pplus', 'theme.nonexistent')).toBeUndefined();
    });

    it('returns undefined when traversing through a non-object value', () => {
        expect(getConfig('pplus', 'brandName.nonexistent')).toBeUndefined();
    });
});
