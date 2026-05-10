import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDrakorInfo, fetchEpisodes } from '../api/config';
import { Play, Calendar, Tag, Info, ChevronRight } from 'lucide-react';

export default function Detail() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [infoData, epData] = await Promise.all([
        fetchDrakorInfo(id),
        fetchEpisodes(id)
      ]);

      setInfo(infoData.data || infoData);
      setEpisodes(epData.data || []);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-primary animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO CLEAN */}
      <div className="relative h-[55vh] md:h-[70vh] overflow-hidden">

        {/* background */}
        <img
          src={info?.image}
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30 object-top"
        />

        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        {/* content */}
        <div className="absolute bottom-0 w-full px-5 md:px-20 pb-10">

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-end">

            {/* POSTER FLOAT */}
            <img
              src={info?.image}
              className="w-40 md:w-60 lg:w-72 rounded-xl shadow-2xl border border-white/10 -translate-y-6"
            />

            {/* INFO */}
            <div className="flex-1">

              <h1 className="text-2xl md:text-5xl font-black mb-3">
                {info?.title}
              </h1>

              {/* META */}
              <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-300 mb-4">

                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {info?.date}
                </span>

                <span className="flex items-center gap-1">
                  <Tag size={14} /> {info?.category}
                </span>

                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full font-bold">
                  {info?.tipe === "1" ? "Movie" : "Series"}
                </span>

              </div>

              {/* ACTION BUTTON */}
              <div className="flex gap-3 mb-4">

                <Link
                  to={`/watch/${id}/1?streaming=${episodes?.[0]?.streaming}`}
                  className="bg-primary hover:bg-red-600 px-5 py-2 rounded-full font-bold flex items-center gap-2"
                >
                  <Play size={16} /> Watch
                </Link>

                <button className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full">
                  Info
                </button>

              </div>

              {/* DESC */}
              <p className="text-gray-400 text-sm md:text-base max-w-2xl line-clamp-3">
                {info?.shoot?.replace(/Details|Sinopsis/g, '')}
              </p>

            </div>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-5 md:px-20 py-10 max-w-[1400px]">

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-10">

          {/* EPISODES */}
          <div className="lg:col-span-2 xl:col-span-3">

            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Episodes
            </h2>

            <div className="space-y-3">

              {episodes.map((ep) => (
                <Link
                  key={ep.episode_number}
                  to={`/watch/${id}/${ep.episode_number}?streaming=${ep.streaming}`}
                  className="flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition group"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition">
                      {ep.episode_number}
                    </div>

                    <span>Episode {ep.episode_number}</span>

                  </div>

                  <ChevronRight className="text-gray-500 group-hover:text-primary" />

                </Link>
              ))}

            </div>
          </div>

          {/* SIDEBAR */}
          <div className="glass p-6 rounded-2xl h-fit">

            <h3 className="flex items-center gap-2 font-bold mb-6">
              <Info className="text-primary" />
              Detail Info
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Views</span>
                <span>{info?.hits || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Favorites</span>
                <span>{info?.jumlah_favorit || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Update</span>
                <span>{info?.date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-primary font-bold">Ongoing</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}