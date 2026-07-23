import { render, screen } from '@testing-library/react';
import { ContentRow } from './ContentRow';

const shows = [
    { id: '1', title: 'Alpha Dawn', genre: 'Drama' },
    { id: '2', title: 'Beta Squad', genre: 'Comedy' },
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
});
