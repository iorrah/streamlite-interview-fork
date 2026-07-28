import { render, screen } from '@testing-library/react';
import { ContentRowSkeleton } from './ContentRowSkeleton';

describe('ContentRowSkeleton', () => {
    it('renders the heading with the given title', () => {
        render(<ContentRowSkeleton title="Continue Watching" />);

        expect(screen.getByRole('heading', { name: 'Continue Watching' })).toBeInTheDocument();
    });

    it('marks the section as busy and labels it with the title', () => {
        render(<ContentRowSkeleton title="Continue Watching" />);

        const section = screen.getByLabelText('Continue Watching');
        expect(section).toHaveAttribute('aria-busy', 'true');
    });

    it('renders 3 placeholder cards by default', () => {
        const { container } = render(<ContentRowSkeleton title="Continue Watching" />);

        expect(container.querySelectorAll('.card')).toHaveLength(3);
    });

    it('renders the given number of placeholder cards when cardCount is passed', () => {
        const { container } = render(<ContentRowSkeleton title="Continue Watching" cardCount={5} />);

        expect(container.querySelectorAll('.card')).toHaveLength(5);
    });

    it('renders zero cards when cardCount is 0', () => {
        const { container } = render(<ContentRowSkeleton title="Continue Watching" cardCount={0} />);

        expect(container.querySelectorAll('.card')).toHaveLength(0);
    });

    it('hides the placeholder list from assistive technology', () => {
        const { container } = render(<ContentRowSkeleton title="Continue Watching" />);

        expect(container.querySelector('ul')).toHaveAttribute('aria-hidden', 'true');
    });
});