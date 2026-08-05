import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Card from './Card';
import { EmptyState, PosterSkeleton } from './PosterGrid';

function getItems(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

function addUnique(current, incoming) {
  const known = new Set(current.map((item) => String(item.id)));
  return [...current, ...incoming.filter((item) => !known.has(String(item.id)))];
}

export default function BrowsePage({ eyebrow, title, description, fetcher, emptyTitle, emptyDescription }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetcher(1);
      const nextItems = getItems(response);
      setItems(nextItems);
      setPage(2);
      setHasMore(nextItems.length > 0);
    } catch {
      setError('Katalog belum dapat dimuat. Periksa koneksi lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    const timer = window.setTimeout(loadFirstPage, 0);
    return () => window.clearTimeout(timer);
  }, [loadFirstPage]);

  const loadMore = async () => {
    setLoadingMore(true);
    setError('');
    try {
      const response = await fetcher(page);
      const nextItems = getItems(response);
      setItems((current) => addUnique(current, nextItems));
      setPage((current) => current + 1);
      setHasMore(nextItems.length > 0);
    } catch {
      setError('Halaman berikutnya belum dapat dimuat.');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="mb-9 max-w-2xl">
        <p className="section-kicker">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-400">{description}</p>
      </div>

      {loading ? <PosterSkeleton /> : error && items.length === 0 ? (
        <EmptyState title="Belum bisa memuat katalog" description={error} action={<button onClick={loadFirstPage} className="button-secondary"><RefreshCw size={16} /> Coba lagi</button>} />
      ) : items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.07] pb-4">
            <p className="text-sm text-slate-400"><span className="font-semibold text-white">{items.length}</span> judul tersedia</p>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">Pembaruan terkini</p>
          </div>
          <div className="poster-grid">{items.map((item, index) => <Card key={`${item.id || item.link || index}-${index}`} data={item} />)}</div>
          {error && <p className="mt-6 text-center text-sm text-rose-300">{error}</p>}
          {hasMore && <div className="mt-12 flex justify-center"><button onClick={loadMore} disabled={loadingMore} className="button-secondary disabled:cursor-wait disabled:opacity-60">{loadingMore ? <><span className="spinner" /> Memuat</> : 'Tampilkan lebih banyak'}</button></div>}
        </>
      )}
    </section>
  );
}
