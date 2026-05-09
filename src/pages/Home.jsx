import { useEffect, useState } from 'react';
import { fetchDrakorList } from '../api/config';
import Card from '../components/Card';

export default function Home() {
  const [drakors, setDrakors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDrakor = async () => {
      try {
        setLoading(true);
        const data = await fetchDrakorList();
        // The API returns { status: 1, data: [...] }
        setDrakors(data.data || []); 
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data dari server. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    getDrakor();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero"
          className="h-full w-full object-cover"
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

      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Terbaru Hari Ini</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">Lihat Semua</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {drakors.length > 0 ? (
              drakors.map((item, index) => (
                <Card key={index} data={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Tidak ada data drakor ditemukan.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
