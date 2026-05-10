import { useEffect, useState, useCallback } from 'react';
import { Film } from 'lucide-react';
import { fetchMovieDrakor } from '../api/config';
import Card from '../components/Card';

export default function Movie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (pageNum, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      if (isInitial) {
        const [p1, p2, p3] = await Promise.all([
          fetchMovieDrakor(1),
          fetchMovieDrakor(2),
          fetchMovieDrakor(3),
        ]);
        const combined = [
          ...(p1.data || []),
          ...(p2.data || []),
          ...(p3.data || []),
        ];
        setMovies(combined);
        setPage(4);
        if (!(p3.data && p3.data.length > 0)) setHasMore(false);
      } else {
        const response = await fetchMovieDrakor(pageNum);
        const newItems = response.data || [];
        setMovies(prev => [...prev, ...newItems]);
        setPage(pageNum + 1);
        if (newItems.length === 0) setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data movie.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  return (
    <div className="min-h-screen container mx-auto px-6 py-10 max-w-[1400px]">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-primary/20 p-3 rounded-xl">
          <Film className="text-primary" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Korean Movie
          </h1>
          <p className="text-gray-400 mt-1">
            {loading ? 'Memuat koleksi film Korea...' : `${movies.length} film Korea tersedia`}
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-2xl bg-dark-accent animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchPage(1, true)}
            className="bg-primary hover:bg-red-700 px-6 py-3 rounded-full text-white font-semibold transition-all"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {movies.length > 0 ? (
              movies.map((item, index) => (
                <Card
                  key={`${item.id || index}-${index}`}
                  data={item}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Tidak ada movie ditemukan.
              </div>
            )}
          </div>

          {/* Load More */}
          {hasMore && movies.length > 0 && (
            <div className="flex justify-center mt-12">
              {loadingMore ? (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Memuat lebih banyak...
                </div>
              ) : (
                <button
                  onClick={() => fetchPage(page)}
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
  );
}