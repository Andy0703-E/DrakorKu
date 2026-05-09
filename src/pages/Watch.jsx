import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { fetchStreamingLink, fetchDrakorInfo, fetchEpisodes } from '../api/config';
import { ChevronLeft, ChevronRight, Settings, Share2, Play } from 'lucide-react';

export default function Watch() {
  const { id, ep } = useParams();
  const [searchParams] = useSearchParams();
  const streamingId = searchParams.get('streaming');
  const navigate = useNavigate();

  const [videoLinks, setVideoLinks] = useState(null);
  const [info, setInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerKey, setPlayerKey] = useState(0); // force video remount

  const currentEp = parseInt(ep) || 1;

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        setVideoLinks(null);

        const [links, infoData, epData] = await Promise.all([
          fetchStreamingLink(streamingId, id, currentEp),
          fetchDrakorInfo(id),
          fetchEpisodes(id),
        ]);

        setVideoLinks(links);
        setInfo(infoData.data || infoData);
        setEpisodes(epData.data || []);

        // Pilih kualitas terbaik yang tersedia
        if (links?.['720p']) setSelectedQuality('720p');
        else if (links?.['480p']) setSelectedQuality('480p');
        else if (links?.['360p']) setSelectedQuality('360p');

        // Force remount video element setiap ganti episode
        setPlayerKey(prev => prev + 1);

      } catch (err) {
        console.error(err);
        setError('Gagal memuat player video. Coba episode lain.');
      } finally {
        setLoading(false);
      }
    };

    if (streamingId) {
      getData();
    } else {
      setLoading(false);
      setError('Streaming ID tidak ditemukan. Kembali dan pilih episode.');
    }
  }, [id, ep, streamingId]); // reactive terhadap perubahan episode

  const handleEpisodeClick = (epData) => {
    navigate(`/watch/${id}/${epData.episode_number}?streaming=${epData.streaming}`);
  };

  const prevEp = episodes.find(e => e.episode_number === currentEp - 1);
  const nextEp = episodes.find(e => e.episode_number === currentEp + 1);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          <Link
            to={`/drakor/${id}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline">Kembali</span>
          </Link>

          <div className="text-center flex-1 px-2">
            <h1 className="font-bold text-sm md:text-lg truncate">
              {info?.title || '...'}
            </h1>
            <p className="text-primary text-xs font-semibold">
              Episode {currentEp}
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <Share2 size={18} className="hover:text-white cursor-pointer" />
            <Settings size={18} className="hover:text-white cursor-pointer" />
          </div>

        </div>
      </div>

      {/* VIDEO PLAYER */}
      <div className="w-full aspect-video bg-black relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Menyiapkan episode {currentEp}...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-4">
            <p className="text-red-400">{error}</p>
            <Link to={`/drakor/${id}`} className="bg-primary px-6 py-2 rounded-full text-white">
              Kembali ke Detail
            </Link>
          </div>
        ) : videoLinks?.[selectedQuality] ? (
          <video
            key={`${playerKey}-${selectedQuality}`}
            controls
            autoPlay
            className="w-full h-full"
            poster={info?.image}
          >
            <source src={videoLinks[selectedQuality]} type="video/mp4" />
            Browser tidak support video HTML5.
          </video>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-center px-6 gap-4">
            <p>Link streaming tidak tersedia untuk episode ini.</p>
            <Link to={`/drakor/${id}`} className="bg-primary px-6 py-2 rounded-full text-white">
              Kembali
            </Link>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="container mx-auto px-4 md:px-6 py-8">

        {/* QUALITY + NAV */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">

          {/* Quality Selector */}
          <div>
            <h2 className="text-lg font-bold mb-3">Episode {currentEp}</h2>
            <p className="text-gray-400 text-sm mb-3">
              Kualitas: <span className="text-primary font-bold">{selectedQuality}</span>
            </p>
            <div className="flex gap-3 flex-wrap">
              {['360p', '480p', '720p'].map(q =>
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
              )}
            </div>
          </div>

          {/* Prev / Next Nav */}
          <div className="flex items-center gap-3">
            {prevEp ? (
              <button
                onClick={() => handleEpisodeClick(prevEp)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
              >
                <ChevronLeft size={16} /> Ep {prevEp.episode_number}
              </button>
            ) : (
              <span />
            )}
            {nextEp ? (
              <button
                onClick={() => handleEpisodeClick(nextEp)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-red-600 transition text-sm font-bold"
              >
                Ep {nextEp.episode_number} <ChevronRight size={16} />
              </button>
            ) : (
              <span />
            )}
          </div>

        </div>

        {/* EPISODE LIST */}
        <div className="glass p-5 rounded-2xl">
          <h3 className="font-bold mb-4 text-sm text-gray-300 uppercase tracking-widest">
            Semua Episode
          </h3>
          {episodes.length === 0 ? (
            <p className="text-gray-500 text-sm">Memuat daftar episode...</p>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {episodes.map((epItem) => (
                <button
                  key={epItem.episode_number}
                  onClick={() => handleEpisodeClick(epItem)}
                  className={`py-2 text-center rounded-lg text-xs font-bold transition ${
                    currentEp === epItem.episode_number
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/15'
                  }`}
                >
                  {epItem.episode_number}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}