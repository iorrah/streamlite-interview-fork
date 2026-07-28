import { type CSSProperties } from 'react';
import { catalog } from './api';
import { ContentRow } from './ContentRow';
import { ContinueWatchingRow } from './ContinueWatchingRow';
import { getBrand, getConfig } from './config';

export function App() {
    const brand = getBrand();
    const brandName = getConfig<string>(brand, 'brandName');
    const accent = getConfig<string>(brand, 'theme.accent');
    const rowKeys = getConfig<string[]>(brand, 'home.rows') ?? [];
    const continueWatchingEnabled = getConfig<boolean>(brand, 'features.continueWatching') ?? false;

    return (
        <div className="page" style={{ '--accent': accent } as CSSProperties}>
            <header>
                <span className="logo">{brandName}</span>
                <nav aria-label="Switch brand">
                    <a href="/?brand=pplus" aria-current={brand === 'pplus' ? 'page' : undefined}>
                        Paramount+
                    </a>
                    <a href="/?brand=ptv" aria-current={brand === 'ptv' ? 'page' : undefined}>
                        Pluto TV
                    </a>
                </nav>
            </header>
            <main>
                <ContinueWatchingRow enabled={continueWatchingEnabled} />

                {rowKeys.map((key) => {
                    const row = catalog[key];
                    return row ? <ContentRow key={key} title={row.title} shows={row.shows} /> : null;
                })}
            </main>
        </div>
    );
}