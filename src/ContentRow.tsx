import type { Show } from './api';

interface ContentRowProps {
    title: string;
    shows: Show[];
}

export function ContentRow({ title, shows }: ContentRowProps) {
    if (shows.length === 0) {
        return null;
    }

    return (
        <section className="row" aria-label={title}>
            <h2>{title}</h2>
            <ul>
                {shows.map((show) => (
                    <li key={show.id} className="card">
                        <div className="poster" aria-hidden="true">
                            {show.title[0]}
                        </div>
                        <h3>{show.title}</h3>
                        <p>{show.genre}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
