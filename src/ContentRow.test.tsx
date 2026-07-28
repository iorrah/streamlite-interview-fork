import { render, screen } from '@testing-library/react';
import { ContentRow } from './ContentRow';

const shows = [
    { id: '1', title: 'Alpha Dawn', genre: 'Drama' },
    { id: '2', title: 'Beta Squad', genre: 'Comedy' },
];

const continueWatchingShows = [
    { id: 'cw-1', title: 'Harbor Lights', genre: 'Drama', progress: 0.42 },
    { id: 'cw-2', title: 'Orbital', genre: 'Sci-Fi', progress: 0.87 },
];

describe('ContentRow', () => {
    it('renders the heading and one card per show', () => {
        render(<ContentRow title="Trending Now" shows={shows} />);

        expect(screen.getByRole('heading', { name: 'Trending Now' })).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('renders nothing when there are no shows', () => {
        const { container } = render(<ContentRow title="Empty" shows={[]} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('does not render a progress bar for shows without progress', () => {
        render(<ContentRow title="Trending Now" shows={shows} />);

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('renders a progress bar for each item that has progress', () => {
        render(<ContentRow title="Continue Watching" shows={continueWatchingShows} />);

        expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });

    it('sets the progress bar value to match the progress fraction', () => {
        render(<ContentRow title="Continue Watching" shows={continueWatchingShows} />);

        const bars = screen.getAllByRole('progressbar');
        expect(bars[0]).toHaveAttribute('aria-valuenow', '42');
        expect(bars[1]).toHaveAttribute('aria-valuenow', '87');
    });

    it('handles a mix of shows with and without progress', () => {
        render(<ContentRow title="Mixed" shows={[...shows, ...continueWatchingShows]} />);

        expect(screen.getAllByRole('listitem')).toHaveLength(4);
        expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });
});
