import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchDrakor } from '../api/config';
import Card from '../components/Card';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearch = async () => {
      try {
        setLoading(true);

        const res = await searchDrakor(q);

        setData(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (q) loadSearch();
  }, [q]);

  return (
    <div className="min-h-screen container mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">
        Hasil pencarian: <span className="text-primary">{q}</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-dark-accent animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.length > 0 ? (
            data.map((item, i) => (
              <Card key={i} data={item} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Tidak ditemukan hasil
            </p>
          )}
        </div>
      )}
    </div>
  );
}