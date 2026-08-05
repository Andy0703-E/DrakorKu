export function PosterSkeleton({ count = 12 }) {
  return (
    <div className="poster-grid" aria-label="Memuat katalog">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="aspect-[2/3] rounded-2xl bg-white/[0.055] animate-pulse" />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] px-6 py-16 text-center">
      <p className="text-lg font-bold text-white">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
