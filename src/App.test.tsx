import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { App } from './App';

vi.mock('./ContinueWatchingRow', () => ({
    ContinueWatchingRow: ({ enabled }: { enabled: boolean }) =>
        enabled ? <div data-testid="continue-watching-stub" /> : null,
}));

function setBrand(brand: string) {
    window.history.pushState({}, '', `/?brand=${brand}`);
}

describe('App', () => {
    it('renders the brand name and nav for Paramount+', () => {
        setBrand('pplus');
        render(<App />);

        expect(screen.getByText('Paramount+', { selector: '.logo' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Paramount+' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Pluto TV' })).not.toHaveAttribute('aria-current');
    });

    it('renders the correct catalog rows per brand', () => {
        setBrand('ptv');
        render(<App />);

        expect(screen.getByRole('heading', { name: 'Live TV' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Movies' })).not.toBeInTheDocument();
    });

    it('passes enabled=true to ContinueWatchingRow for a brand with the feature on', () => {
        setBrand('pplus');
        render(<App />);

        expect(screen.getByTestId('continue-watching-stub')).toBeInTheDocument();
    });

    it('passes enabled=false to ContinueWatchingRow for a brand with the feature off', () => {
        setBrand('ptv');
        render(<App />);

        expect(screen.queryByTestId('continue-watching-stub')).not.toBeInTheDocument();
    });
});
