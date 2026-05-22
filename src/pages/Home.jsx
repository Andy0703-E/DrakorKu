import { useEffect, useState, useCallback } from 'react';
import { fetchDrakorList } from '../api/config';
import Card from '../components/Card';

export default function Home() {
  const [drakors, setDrakors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const p1Promise = fetchDrakorList(1);
        const p2Promise = fetchDrakorList(2);
        const p3Promise = fetchDrakorList(3);

        p1Promise.then(p1 => {
          if (!cancelled) {
            setDrakors(p1.data || []);
            setPage(2);
            setLoading(false);
          }
        });

        const [, p2, p3] = await Promise.all([p1Promise, p2Promise, p3Promise]);
        if (cancelled) return;

        setDrakors(prev => [...prev, ...(p2.data || []), ...(p3.data || [])]);
        setPage(4);
        if (!(p3.data && p3.data.length > 0)) setHasMore(false);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError('Gagal mengambil data dari server. Silakan coba lagi nanti.');
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();

    return () => { cancelled = true; };
  }, []);

  const handleLoadMore = useCallback(async () => {
    try {
      setLoadingMore(true);
      const data = await fetchDrakorList(page);
      const newItems = data.data || [];
      setDrakors(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
      if (newItems.length === 0) setHasMore(false);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data dari server. Silakan coba lagi nanti.');
    } finally {
      setLoadingMore(false);
    }
  }, [page]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop"
          alt="Hero"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 z-20">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            NONTON <span className="text-primary">DRAKOR</span> <br />
            TANPA BATAS
          </h1>
          <p className="text-gray-300 max-w-xl text-lg mb-8 leading-relaxed">
            Streaming drama Korea terbaru dan terpopuler dengan kualitas terbaik.
            Semua tersedia di DrakorKu secara gratis.
          </p>
          <div className="flex gap-4">
            <button className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105">
              Mulai Menonton
            </button>
            <button className="glass hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition-all">
              Daftar List
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Terbaru Hari Ini</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
          <span className="text-gray-400 text-sm">{drakors.length} film ditampilkan</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-dark-accent animate-pulse rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {drakors.length > 0 ? (
                drakors.map((item, index) => (
                  <Card key={`${item.id || index}-${index}`} data={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                  Tidak ada data drakor ditemukan.
                </div>
              )}
            </div>

            {/* Load More */}
            {hasMore && drakors.length > 0 && (
              <div className="flex justify-center mt-12">
                {loadingMore ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Memuat lebih banyak...
                  </div>
                ) : (
                  <button
                    onClick={handleLoadMore}
                    className="bg-primary hover:bg-red-700 text-white px-10 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-primary/30"
                  >
                    Muat Lebih Banyak
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
