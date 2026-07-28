import { useEffect, useState } from 'react';
import { type ContinueWatchingItem, fetchContinueWatching } from './api';
import { ContentRow } from './ContentRow';
import { ContentRowSkeleton } from './ContentRowSkeleton';

interface ContinueWatchingRowProps {
    enabled: boolean;
}

export function ContinueWatchingRow({ enabled }: ContinueWatchingRowProps) {
    const [items, setItems] = useState<ContinueWatchingItem[]>([]);
    const [isLoading, setIsLoading] = useState(enabled);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let cancelled = false;

        async function load() {
            setIsLoading(true);
            try {
                const data = await fetchContinueWatching();
                if (!cancelled) {
                    setItems(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setItems([]);
                }
                console.error('Failed to load continue watching:', error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [enabled]);

    if (!enabled) {
        return null;
    }

    return isLoading ? (
        <ContentRowSkeleton title="Continue Watching" cardCount={3} />
    ) : (
        <ContentRow title="Continue Watching" shows={items} />
    );
}
