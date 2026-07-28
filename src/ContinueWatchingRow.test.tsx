import { render, screen, waitFor } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { ContinueWatchingRow } from './ContinueWatchingRow';
import { fetchContinueWatching } from './api';

vi.mock('./api', async () => {
    const actual = await vi.importActual<typeof import('./api')>('./api');
    return {
        ...actual,
        fetchContinueWatching: vi.fn(),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe('ContinueWatchingRow', () => {
    it('renders nothing and does not fetch when disabled', () => {
        render(<ContinueWatchingRow enabled={false} />);

        expect(screen.queryByRole('heading', { name: 'Continue Watching' })).not.toBeInTheDocument();
        expect(fetchContinueWatching).not.toHaveBeenCalled();
    });

    it('shows a skeleton while the fetch is pending', () => {
        (fetchContinueWatching as Mock).mockReturnValue(new Promise(() => {}));

        render(<ContinueWatchingRow enabled={true} />);

        expect(screen.getByRole('heading', { name: 'Continue Watching' })).toBeInTheDocument();
        expect(screen.getByLabelText('Continue Watching')).toHaveAttribute('aria-busy', 'true');
    });

    it('replaces the skeleton with real content once the fetch resolves', async () => {
        (fetchContinueWatching as Mock).mockResolvedValue([
            { id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 },
        ]);

        render(<ContinueWatchingRow enabled={true} />);

        expect(await screen.findByText('Harbor Lights')).toBeInTheDocument();
        expect(screen.getByLabelText('Continue Watching')).not.toHaveAttribute('aria-busy', 'true');
    });

    it('hides the row entirely if the fetch fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (fetchContinueWatching as Mock).mockRejectedValue(new Error('network error'));

        render(<ContinueWatchingRow enabled={true} />);

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Continue Watching' })).not.toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load continue watching:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('does not update state after unmount if the fetch resolves late', async () => {
        let resolvePromise: (value: unknown[]) => void;
        (fetchContinueWatching as Mock).mockReturnValue(
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        const { unmount } = render(<ContinueWatchingRow enabled={true} />);
        unmount();

        resolvePromise!([{ id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 }]);
        await Promise.resolve();
    });
});
