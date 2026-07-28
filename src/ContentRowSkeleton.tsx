interface ContentRowSkeletonProps {
    title: string;
    cardCount?: number;
}

export function ContentRowSkeleton({ title, cardCount = 3 }: ContentRowSkeletonProps) {
    return (
        <section className="row" aria-label={title} aria-busy="true">
            <h2>{title}</h2>
            <ul aria-hidden="true">
                {Array.from({ length: cardCount }, (_, i) => (
                    <li key={i} className="card">
                        <div className="poster poster--skeleton" aria-hidden="true" />
                        <div className="skeleton-line skeleton-line--title" />
                        <div className="skeleton-line skeleton-line--subtitle" />
                    </li>
                ))}
            </ul>
        </section>
    );
}
