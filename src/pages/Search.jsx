import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { searchDrakor } from '../api/config';
import Card from '../components/Card';
import { EmptyState, PosterSkeleton } from '../components/PosterGrid';

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = (params.get('q') || '').trim();
  const [input, setInput] = useState(query);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState('');

  const loadSearch = useCallback(async () => {
    if (!query) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await searchDrakor(query);
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch {
      setError('Pencarian belum dapat dilakukan. Coba lagi sebentar lagi.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setInput(query);
      loadSearch();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadSearch, query]);

  const submit = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <section className="page-shell">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-white"><ArrowLeft size={16} /> Kembali ke katalog</Link>
      <div className="mt-7 max-w-3xl">
        <p className="section-kicker">Pencarian katalog</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">Cari tontonanmu.</h1>
        <form onSubmit={submit} className="mt-6 flex gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.04] p-2 focus-within:border-lime-300/60">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3 text-slate-400"><SearchIcon size={19} /><input value={input} onChange={(event) => setInput(event.target.value)} type="search" autoFocus placeholder="Contoh: romance, thriller, judul drama" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-500" /></label>
          <button type="submit" className="button-primary shrink-0 px-4 sm:px-5"><span className="hidden sm:inline">Cari</span><SearchIcon size={17} /></button>
        </form>
      </div>

      <div className="mt-10">
        {!query ? <EmptyState title="Masukkan judul atau kata kunci" description="Gunakan pencarian untuk menemukan drama, movie, atau genre favoritmu." /> : loading ? <PosterSkeleton /> : error ? (
          <EmptyState title="Pencarian gagal" description={error} action={<button onClick={loadSearch} className="button-secondary">Coba lagi</button>} />
        ) : items.length ? (
          <><p className="mb-5 text-sm text-slate-400">Ditemukan <strong className="text-white">{items.length}</strong> hasil untuk <strong className="text-lime-300">“{query}”</strong></p><div className="poster-grid">{items.map((item, index) => <Card key={`${item.id || index}-${index}`} data={item} />)}</div></>
        ) : <EmptyState title="Belum menemukan hasil" description={`Tidak ada judul yang cocok dengan “${query}”. Coba kata kunci yang lebih singkat.`} />}
      </div>
    </section>
  );
}
