import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { fetchStreamingLink, fetchDrakorInfo, fetchEpisodes } from '../api/config';
import { ChevronLeft, ChevronRight, Settings, Share2, Download, Wifi, Coffee } from 'lucide-react';
import qrisImage from '../../assets/image/qris.jpeg';

// Deteksi kualitas terbaik berdasarkan jaringan
function getQualityFromNetwork() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return '720p'; // default jika tidak support

  const { effectiveType, downlink } = conn;

  if (effectiveType === '4g' || downlink >= 5) return '720p';
  if (effectiveType === '3g' || downlink >= 1.5) return '480p';
  return '360p';
}

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
  const [networkQuality, setNetworkQuality] = useState('');

  const [showTraktir, setShowTraktir] = useState(true);
  const [traktirCountdown, setTraktirCountdown] = useState(10);

  const videoRef = useRef(null);
  const savedTimeRef = useRef(0);
  const [isSwitchingQuality, setIsSwitchingQuality] = useState(false);

  const currentEp = parseInt(ep) || 1;

  // Countdown auto-dismiss untuk traktir screen
  useEffect(() => {
    if (!showTraktir || traktirCountdown <= 0) return;
    const timer = setInterval(() => {
      setTraktirCountdown(prev => {
        if (prev <= 1) {
          setShowTraktir(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showTraktir, traktirCountdown]);

  // Reset traktir saat ganti episode
  useEffect(() => {
    setShowTraktir(true);
    setTraktirCountdown(10);
  }, [id, ep, streamingId]);

  // Auto-detect network quality saat pertama load dan saat koneksi berubah
  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const updateQuality = () => {
      const q = getQualityFromNetwork();
      setNetworkQuality(q);
    };

    updateQuality();
    conn?.addEventListener('change', updateQuality);
    return () => conn?.removeEventListener('change', updateQuality);
  }, []);

  // Load data episode
  useEffect(() => {
    if (!streamingId) return;

    let cancelled = false;

    async function getData() {
      try {
        setLoading(true);
        setError(null);
        setVideoLinks(null);
        savedTimeRef.current = 0;
        setIsSwitchingQuality(false);

        const [links, infoData, epData] = await Promise.all([
          fetchStreamingLink(streamingId, id, currentEp),
          fetchDrakorInfo(id),
          fetchEpisodes(id),
        ]);

        if (cancelled) return;

        setVideoLinks(links);
        setInfo(infoData.data || infoData);
        setEpisodes(epData.data || []);

        const preferredQ = getQualityFromNetwork();
        if (links?.[preferredQ]) setSelectedQuality(preferredQ);
        else if (links?.['720p']) setSelectedQuality('720p');
        else if (links?.['480p']) setSelectedQuality('480p');
        else if (links?.['360p']) setSelectedQuality('360p');

      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError('Gagal memuat player video. Coba episode lain.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getData();

    return () => { cancelled = true; };
  }, [id, ep, streamingId, currentEp]);

  // Saat ganti kualitas: simpan waktu sekarang, set flag, lalu ganti
  const handleQualityChange = useCallback((q) => {
    if (videoRef.current && !videoRef.current.paused) {
      savedTimeRef.current = videoRef.current.currentTime;
    } else if (videoRef.current) {
      savedTimeRef.current = videoRef.current.currentTime;
    }
    setIsSwitchingQuality(true);
    setSelectedQuality(q);
  }, []);

  // Setelah video baru bisa diputar: lanjut dari posisi tersimpan
  const handleCanPlay = useCallback(() => {
    if (isSwitchingQuality && savedTimeRef.current > 0 && videoRef.current) {
      videoRef.current.currentTime = savedTimeRef.current;
      videoRef.current.play().catch(() => {});
      setIsSwitchingQuality(false);
    }
  }, [isSwitchingQuality]);

  const handleEpisodeClick = (epData) => {
    navigate(`/watch/${id}/${epData.episode_number}?streaming=${epData.streaming}`);
  };

  const prevEp = episodes.find(e => e.episode_number === currentEp - 1);
  const nextEp = episodes.find(e => e.episode_number === currentEp + 1);

  if (!streamingId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-6 py-20">
          <p className="text-red-400 text-lg mb-4">Streaming ID tidak ditemukan. Pilih episode terlebih dahulu.</p>
          <Link to={`/drakor/${id}`} className="inline-block bg-primary px-6 py-2 rounded-full text-white">
            Kembali ke Detail
          </Link>
        </div>
      </div>
    );
  }

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
            {networkQuality && (
              <span className="hidden md:flex items-center gap-1 text-xs text-emerald-400">
                <Wifi size={14} /> {networkQuality}
              </span>
            )}
            <Share2 size={18} className="hover:text-white cursor-pointer" />
            <Settings size={18} className="hover:text-white cursor-pointer" />
          </div>

        </div>
      </div>

      {showTraktir && !loading && !error && videoLinks?.[selectedQuality] ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-black px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Coffee size={28} className="text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Traktir Kopi</h2>
          </div>
          <img
            src={qrisImage}
            alt="QRIS"
            className="w-56 h-56 md:w-72 md:h-72 object-contain mb-6 rounded-2xl shadow-lg shadow-primary/20"
          />
          <p className="text-gray-300 text-center max-w-md text-sm md:text-base leading-relaxed mb-8">
            Jika aplikasi ini bermanfaat, Anda dapat memberikan dukungan melalui QRIS. Dukungan Anda membantu pengembangan dan pemeliharaan aplikasi agar terus berkembang.
          </p>
          <button
            onClick={() => setShowTraktir(false)}
            className="bg-primary hover:bg-red-600 text-white font-bold px-10 py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-lg"
          >
            Lanjutkan Nonton ({traktirCountdown}s)
          </button>
        </div>
      ) : (
        <div className="w-full aspect-video md:aspect-auto md:h-[75vh] bg-black relative flex justify-center">
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
              ref={videoRef}
              key={`${id}-${ep}-${selectedQuality}`}
              controls
              autoPlay
              className="w-full h-full md:max-w-6xl object-contain"
              poster={info?.image}
              onCanPlay={handleCanPlay}
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
      )}

      {/* INFO SECTION */}
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-[1400px]">

        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">

          {/* Quality + Download */}
          <div>
            <h2 className="text-lg font-bold mb-1">Episode {currentEp}</h2>

            {/* Network hint */}
            {networkQuality && (
              <p className="text-xs text-emerald-400 mb-3 flex items-center gap-1">
                <Wifi size={12} />
                Kualitas otomatis: <span className="font-bold">{networkQuality}</span>
                &nbsp;(berdasarkan kecepatan jaringan)
              </p>
            )}

            {/* Quality Selector */}
            <p className="text-gray-400 text-sm mb-2">
              Sedang diputar: <span className="text-primary font-bold">{selectedQuality}</span>
              {isSwitchingQuality && (
                <span className="ml-2 text-xs text-yellow-400">Melanjutkan dari posisi sebelumnya...</span>
              )}
            </p>
            <div className="flex gap-3 flex-wrap mb-5">
              {['360p', '480p', '720p'].map(q =>
                videoLinks?.[q] && (
                  <button
                    key={q}
                    onClick={() => handleQualityChange(q)}
                    className={`px-5 py-2 rounded-lg font-bold transition ${
                      selectedQuality === q
                        ? 'bg-primary text-white ring-2 ring-primary/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {q}
                    {q === networkQuality && (
                      <span className="ml-1 text-[10px] text-emerald-400">✦</span>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Download */}
            {!loading && !error && videoLinks && (
              <div>
                <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest">
                  Download Episode {currentEp}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['360p', '480p', '720p'].map(q =>
                    videoLinks?.[q] && (
                      <a
                        key={q}
                        href={videoLinks[q]}
                        download={`${info?.title || 'episode'}-ep${currentEp}-${q}.mp4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40 transition text-sm font-bold"
                      >
                        <Download size={14} />
                        {q}
                      </a>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next Nav */}
          <div className="flex items-center gap-3 self-start mt-2">
            {prevEp ? (
              <button
                onClick={() => handleEpisodeClick(prevEp)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
              >
                <ChevronLeft size={16} /> Ep {prevEp.episode_number}
              </button>
            ) : <span />}
            {nextEp ? (
              <button
                onClick={() => handleEpisodeClick(nextEp)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-red-600 transition text-sm font-bold"
              >
                Ep {nextEp.episode_number} <ChevronRight size={16} />
              </button>
            ) : <span />}
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