    import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';

import { fetchMovieDrakor } from '../api/config';
import Card from '../components/Card';

export default function Movie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);

        const response = await fetchMovieDrakor();

        setMovies(response.data || []);
      } catch (err) {
        console.error(err);

        setError('Gagal mengambil data movie.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="min-h-screen container mx-auto px-6 py-10">
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
            Koleksi film Korea terbaik dan terbaru
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-2xl bg-dark-accent animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-red-500 text-lg mb-4">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-red-700 px-6 py-3 rounded-full text-white font-semibold transition-all"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.length > 0 ? (
            movies.map((item, index) => (
              <Card
                key={item.id || index}
                data={item}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              Tidak ada movie ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}