import { render, screen, waitFor } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { App } from './App';
import { fetchContinueWatching } from './api';

vi.mock('./api', async () => {
    const actual = await vi.importActual<typeof import('./api')>('./api');
    return {
        ...actual,
        fetchContinueWatching: vi.fn(),
    };
});

function setBrand(brand: string) {
    window.history.pushState({}, '', `/?brand=${brand}`);
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('App', () => {
    it('renders the brand name and nav for Paramount+', async () => {
        setBrand('pplus');
        (fetchContinueWatching as Mock).mockResolvedValue([]);

        render(<App />);

        expect(screen.getByText('Paramount+', { selector: '.logo' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Paramount+' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Pluto TV' })).not.toHaveAttribute('aria-current');

        await waitFor(() => expect(fetchContinueWatching).toHaveBeenCalled());
    });

    it('renders the correct catalog rows per brand', async () => {
        setBrand('ptv');
        (fetchContinueWatching as Mock).mockResolvedValue([]);

        render(<App />);

        expect(screen.getByRole('heading', { name: 'Live TV' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Movies' })).not.toBeInTheDocument();
    });

    it('shows a Continue Watching skeleton while the fetch is pending, for a brand with the feature enabled', () => {
        setBrand('pplus');
        (fetchContinueWatching as Mock).mockReturnValue(new Promise(() => {})); // never resolves

        render(<App />);

        expect(screen.getByRole('heading', { name: 'Continue Watching' })).toBeInTheDocument();
        expect(screen.getByLabelText('Continue Watching')).toHaveAttribute('aria-busy', 'true');
    });

    it('replaces the skeleton with real content once the fetch resolves', async () => {
        setBrand('pplus');
        (fetchContinueWatching as Mock).mockResolvedValue([
            { id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 },
        ]);

        render(<App />);

        expect(await screen.findByText('Harbor Lights')).toBeInTheDocument();
        expect(screen.getByLabelText('Continue Watching')).not.toHaveAttribute('aria-busy', 'true');
    });

    it('does not show a Continue Watching row at all for a brand with the feature disabled', () => {
        setBrand('ptv');
        (fetchContinueWatching as Mock).mockResolvedValue([
            { id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 },
        ]);

        render(<App />);

        expect(screen.queryByRole('heading', { name: 'Continue Watching' })).not.toBeInTheDocument();
        expect(fetchContinueWatching).not.toHaveBeenCalled();
    });

    it('hides the Continue Watching row entirely if the fetch fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        setBrand('pplus');
        (fetchContinueWatching as Mock).mockRejectedValue(new Error('network error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Continue Watching' })).not.toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load continue watching:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('does not update state after unmount if the fetch resolves late', async () => {
        setBrand('pplus');
        let resolvePromise: (value: unknown[]) => void;
        (fetchContinueWatching as Mock).mockReturnValue(
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        const { unmount } = render(<App />);
        unmount();

        resolvePromise!([{ id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 }]);
        await Promise.resolve();
    });
});