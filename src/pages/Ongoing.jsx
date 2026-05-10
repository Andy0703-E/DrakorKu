import { useEffect, useState, useCallback } from 'react';
import { fetchOngoingDrakor } from '../api/config';
import Card from '../components/Card';

export default function Ongoing() {
  const [drakors, setDrakors] = useState([]);
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
          fetchOngoingDrakor(1),
          fetchOngoingDrakor(2),
          fetchOngoingDrakor(3),
        ]);
        const combined = [
          ...(p1.data || []),
          ...(p2.data || []),
          ...(p3.data || []),
        ];
        setDrakors(combined);
        setPage(4);
        if (!(p3.data && p3.data.length > 0)) setHasMore(false);
      } else {
        const data = await fetchOngoingDrakor(pageNum);
        const newItems = data.data || [];
        setDrakors(prev => [...prev, ...newItems]);
        setPage(pageNum + 1);
        if (newItems.length === 0) setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data ongoing.');
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
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          DRAMA <span className="text-primary">ONGOING</span>
        </h1>
        <div className="h-1 w-24 bg-primary rounded-full" />
        {!loading && (
          <p className="text-gray-400 mt-3">{drakors.length} drama ongoing ditampilkan</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-dark-accent animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchPage(1, true)}
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
                Tidak ada drama ongoing ditemukan.
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