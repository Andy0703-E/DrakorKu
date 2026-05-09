import { useEffect, useState } from 'react';
import { fetchRecommendedDrakor } from '../api/config';
import Card from '../components/Card';

export default function Recommended() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetchRecommendedDrakor();

        setData(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data recommended');
      } finally {
        setLoading(false);
      }
    };

    load();

  }, []);

  return (
    <div className="min-h-screen container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">
        Recommended Drakor
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-dark-accent animate-pulse rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.map((item, i) => (
            <Card key={i} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}