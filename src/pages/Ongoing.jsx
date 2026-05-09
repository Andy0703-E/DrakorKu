import { useEffect, useState } from 'react';
import { fetchOngoingDrakor } from '../api/config';
import Card from '../components/Card';

export default function Ongoing() {
  const [drakors, setDrakors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOngoing = async () => {
      try {
        setLoading(true);

        const data = await fetchOngoingDrakor();

        setDrakors(data.data || []);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data ongoing.');
      } finally {
        setLoading(false);
      }
    };

    getOngoing();
  }, []);

  return (
    <div className="min-h-screen container mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          DRAMA <span className="text-primary">ONGOING</span>
        </h1>

        <div className="h-1 w-24 bg-primary rounded-full" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
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
            onClick={() => window.location.reload()}
            className="bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {drakors.length > 0 ? (
            drakors.map((item, index) => (
              <Card key={index} data={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              Tidak ada drama ongoing ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}