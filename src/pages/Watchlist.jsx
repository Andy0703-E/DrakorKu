import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkX } from 'lucide-react';
import Card from '../components/Card';
import { EmptyState } from '../components/PosterGrid';
import { getWatchlist } from '../utils/watchlist';

export default function Watchlist() {
  const [items, setItems] = useState(() => getWatchlist());

  useEffect(() => {
    const refresh = () => setItems(getWatchlist());
    window.addEventListener('watchlist:changed', refresh);
    return () => window.removeEventListener('watchlist:changed', refresh);
  }, []);

  return (
    <section className="page-shell">
      <div className="mb-9 max-w-2xl">
        <p className="section-kicker">Tersimpan untuk nanti</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">Daftar saya</h1>
        <p className="mt-3 text-base leading-7 text-slate-400">Simpan judul yang ingin kamu lanjutkan. Daftar ini tersimpan di perangkatmu.</p>
      </div>
      {items.length ? <div className="poster-grid">{items.map((item) => <Card key={item.id} data={item} />)}</div> : (
        <EmptyState title="Daftarmu masih kosong" description="Tekan ikon simpan pada kartu drama untuk menambahkannya ke sini." action={<Link to="/" className="button-primary"><BookmarkX size={16} /> Jelajahi drama</Link>} />
      )}
    </section>
  );
}
