import { useEffect, useState, type CSSProperties } from 'react';
import { catalog, type ContinueWatchingItem, fetchContinueWatching } from './api';
import { ContentRow } from './ContentRow';
import { ContentRowSkeleton } from './ContentRowSkeleton';
import { getBrand, getConfig } from './config';

export function App() {
    const brand = getBrand();
    const brandName = getConfig<string>(brand, 'brandName');
    const accent = getConfig<string>(brand, 'theme.accent');
    const rowKeys = getConfig<string[]>(brand, 'home.rows') ?? [];
    const continueWatchingEnabled = getConfig<boolean>(brand, 'features.continueWatching') ?? false;

    const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
    const [isLoadingContinueWatching, setIsLoadingContinueWatching] = useState(continueWatchingEnabled);

    useEffect(() => {
        if (!continueWatchingEnabled) {
            return;
        }

        let cancelled = false;

        async function loadContinueWatching() {
            setIsLoadingContinueWatching(true);
            try {
                const items = await fetchContinueWatching();
                if (!cancelled) {
                    setContinueWatching(items);
                }
            } catch (error) {
                if (!cancelled) {
                    setContinueWatching([]);
                }

                console.error('Failed to load continue watching:', error);
            } finally {
                if (!cancelled) {
                    setIsLoadingContinueWatching(false);
                }
            }
        }

        loadContinueWatching();

        return () => {
            cancelled = true;
        };
    }, [continueWatchingEnabled]);

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
                {continueWatchingEnabled && (
                    isLoadingContinueWatching ? (
                        <ContentRowSkeleton title="Continue Watching" cardCount={3} />
                    ) : (
                        <ContentRow title="Continue Watching" shows={continueWatching} />
                    )
                )}

                {rowKeys.map((key) => {
                    const row = catalog[key];
                    return row ? <ContentRow key={key} title={row.title} shows={row.shows} /> : null;
                })}
            </main>
        </div>
    );
}