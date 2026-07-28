export interface Show {
    id: string;
    title: string;
    genre: string;
}

export interface ContinueWatchingItem extends Show {
    /** Fraction watched, between 0 and 1. */
    progress: number;
}

export const catalog: Record<string, { title: string; shows: Show[] }> = {
    trending: {
        title: 'Trending Now',
        shows: [
            { id: 't-1', title: 'Harbor Lights', genre: 'Drama' },
            { id: 't-2', title: 'Quantum Alley', genre: 'Sci-Fi' },
            { id: 't-3', title: 'Midnight Diner Club', genre: 'Mystery' },
            { id: 't-4', title: 'The Last Stand-Up', genre: 'Comedy' },
        ],
    },
    movies: {
        title: 'Movies',
        shows: [
            { id: 'm-1', title: 'Paper Planets', genre: 'Adventure' },
            { id: 'm-2', title: 'Static', genre: 'Thriller' },
            { id: 'm-3', title: 'Second Sunrise', genre: 'Romance' },
        ],
    },
    series: {
        title: 'Series',
        shows: [
            { id: 's-1', title: 'Deep Water Unit', genre: 'Crime' },
            { id: 's-2', title: 'Copper Canyon', genre: 'Western' },
            { id: 's-3', title: 'Orbital', genre: 'Sci-Fi' },
            { id: 's-4', title: 'The Green Room', genre: 'Drama' },
        ],
    },
    liveTv: {
        title: 'Live TV',
        shows: [
            { id: 'l-1', title: 'News 24', genre: 'News' },
            { id: 'l-2', title: 'Retro Toons', genre: 'Kids' },
            { id: 'l-3', title: 'Endless Trivia', genre: 'Game Show' },
        ],
    },
};

/** Pretend network call — resolves after a short delay. */
export function fetchContinueWatching(): Promise<ContinueWatchingItem[]> {
    const items: ContinueWatchingItem[] = [
        { id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 },
        { id: 'cw-2', title: 'Orbital', genre: 'Sci-Fi', progress: 0.87 },
        { id: 'cw-3', title: 'The Last Stand-Up', genre: 'Comedy', progress: 0.15 },
    ];
    return new Promise((resolve) => {
        setTimeout(() => resolve(items), 400);
    });
}

export function isContinueWatchingItem(show: Show): show is ContinueWatchingItem {
    return 'progress' in show && typeof (show as ContinueWatchingItem).progress === 'number';
}
