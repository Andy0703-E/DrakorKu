import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { fetchStreamingLink, fetchDrakorInfo } from '../api/config';
import { ChevronLeft, Settings, Share2 } from 'lucide-react';

export default function Watch() {
  const { id, ep } = useParams();
  const [searchParams] = useSearchParams();
  const streamingId = searchParams.get('streaming');

  const [videoLinks, setVideoLinks] = useState(null);
  const [info, setInfo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const [links, infoData] = await Promise.all([
          fetchStreamingLink(streamingId, id, ep),
          fetchDrakorInfo(id)
        ]);

        setVideoLinks(links);
        setInfo(infoData.data || infoData);

        if (links?.['720p']) setSelectedQuality('720p');
        else if (links?.['480p']) setSelectedQuality('480p');
        else if (links?.['360p']) setSelectedQuality('360p');

      } catch (err) {
        console.error(err);
        setError('Gagal memuat player video.');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id, ep, streamingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-primary font-bold text-lg">
          Menyiapkan Player...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER (FIXED + GLASS) */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          {/* LEFT */}
          <Link
            to={`/drakor/${id}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline">Kembali</span>
          </Link>

          {/* CENTER */}
          <div className="text-center flex-1 px-2">
            <h1 className="font-bold text-sm md:text-lg truncate">
              {info?.title || 'Loading...'}
            </h1>
            <p className="text-primary text-xs font-semibold">
              Episode {ep}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 text-gray-400">
            <Share2 size={18} className="hover:text-white cursor-pointer" />
            <Settings size={18} className="hover:text-white cursor-pointer" />
          </div>

        </div>
      </div>

      {/* VIDEO PLAYER */}
      <div className="w-full aspect-video bg-black relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center px-6">
            {error}
          </div>
        ) : videoLinks?.[selectedQuality] ? (
          <video
            key={videoLinks[selectedQuality]}
            controls
            autoPlay
            className="w-full h-full"
            poster={info?.image}
          >
            <source src={videoLinks[selectedQuality]} type="video/mp4" />
            Browser tidak support video
          </video>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-center px-6">
            <p className="mb-4">
              Link streaming tidak tersedia untuk episode ini.
            </p>
            <Link
              to={`/drakor/${id}`}
              className="bg-primary px-6 py-2 rounded-full text-white"
            >
              Kembali
            </Link>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="container mx-auto px-4 md:px-6 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* LEFT */}
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Episode {ep}
            </h2>

            <p className="text-gray-400 mb-6">
              Kualitas:{" "}
              <span className="text-primary font-bold">
                {selectedQuality}
              </span>
            </p>

            {/* QUALITY SELECT */}
            <div className="flex gap-3 flex-wrap">
              {['360p', '480p', '720p'].map(q => (
                videoLinks?.[q] && (
                  <button
                    key={q}
                    onClick={() => setSelectedQuality(q)}
                    className={`px-5 py-2 rounded-lg font-bold transition ${
                      selectedQuality === q
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {q}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* EPISODE LIST */}
          <div className="glass p-5 rounded-2xl w-full md:w-80">
            <h3 className="font-bold mb-4">Episode</h3>

            <div className="grid grid-cols-4 gap-2">
              {[...Array(12)].map((_, i) => (
                <Link
                  key={i}
                  to={`/watch/${id}/${i + 1}?streaming=${streamingId}`}
                  className={`py-2 text-center rounded text-xs font-bold transition ${
                    parseInt(ep) === i + 1
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}