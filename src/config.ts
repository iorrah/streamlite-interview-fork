export type Brand = 'pplus' | 'ptv';

const blueprints: Record<Brand, Record<string, unknown>> = {
    pplus: {
        brandName: 'Paramount+',
        theme: { accent: '#0064ff' },
        features: { continueWatching: true },
        home: { rows: ['trending', 'movies', 'series'] },
    },
    ptv: {
        brandName: 'Pluto TV',
        theme: { accent: '#fadb31' },
        features: { continueWatching: false },
        home: { rows: ['liveTv', 'trending', 'series'] },
    },
};

/** Resolve the active brand from the URL, e.g. http://localhost:5173/?brand=ptv */
export function getBrand(): Brand {
    const brand = new URLSearchParams(window.location.search).get('brand');
    return brand === 'ptv' ? 'ptv' : 'pplus';
}

/** Look up a config value by dot path, e.g. getConfig('pplus', 'features.continueWatching') */
export function getConfig<T>(brand: Brand, key: string): T | undefined {
    let node: unknown = blueprints[brand];
    for (const segment of key.split('.')) {
        if (node && typeof node === 'object') {
            node = (node as Record<string, unknown>)[segment];
        } else {
            return undefined;
        }
    }
    return node as T | undefined;
}
