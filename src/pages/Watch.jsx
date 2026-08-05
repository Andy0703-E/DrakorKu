import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Coffee, Download, ExternalLink, Settings2, Share2, Wifi } from 'lucide-react';
import { fetchDrakorInfo, fetchEpisodes, fetchStreamingLink } from '../api/config';
import qrisImage from '../../assets/image/qris.jpeg';

function asItems(response) {
  return Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
}

function asObject(response) {
  return response?.data && !Array.isArray(response.data) ? response.data : response || null;
}

function qualityFromNetwork() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return '720p';
  if (connection.effectiveType === '4g' || connection.downlink >= 5) return '720p';
  if (connection.effectiveType === '3g' || connection.downlink >= 1.5) return '480p';
  return '360p';
}

function sourcesFrom(response) {
  const value = asObject(response);
  if (!value) return {};
  if (value.links && typeof value.links === 'object') return value.links;
  return value;
}

export default function Watch() {
  const { id, ep } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const requestedStreaming = params.get('streaming');
  const episodeNumber = Number(ep) || 1;
  const [info, setInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [sources, setSources] = useState({});
  const [quality, setQuality] = useState('720p');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [networkQuality, setNetworkQuality] = useState(() => qualityFromNetwork());
  const [showSupport, setShowSupport] = useState(false);
  const [notice, setNotice] = useState('');

  const loadWatch = useCallback(async () => {
    setLoading(true);
    setError('');
    setSources({});
    try {
      const [infoResponse, episodesResponse] = await Promise.all([fetchDrakorInfo(id), fetchEpisodes(id)]);
      const nextInfo = asObject(infoResponse);
      const nextEpisodes = asItems(episodesResponse).sort((a, b) => Number(a.episode_number) - Number(b.episode_number));
      const matchedEpisode = nextEpisodes.find((item) => Number(item.episode_number) === episodeNumber);
      const streaming = requestedStreaming || matchedEpisode?.streaming;
      if (!nextInfo || nextInfo.status === 0) throw new Error('missing drama');
      if (!streaming) throw new Error('missing episode');

      setInfo(nextInfo);
      setEpisodes(nextEpisodes);
      const linksResponse = await fetchStreamingLink(streaming, id, episodeNumber);
      const nextSources = sourcesFrom(linksResponse);
      const available = ['720p', '480p', '360p'].filter((item) => nextSources[item]);
      if (!available.length) throw new Error('missing source');
      const preferred = qualityFromNetwork();
      setQuality(available.includes(preferred) ? preferred : available[0]);
      setSources(nextSources);
    } catch (caught) {
      const message = caught?.message;
      setError(message === 'missing episode' ? 'Episode ini belum memiliki sumber tontonan.' : 'Pemutar belum dapat disiapkan. Coba pilih episode lain atau muat ulang.');
    } finally {
      setLoading(false);
    }
  }, [episodeNumber, id, requestedStreaming]);

  useEffect(() => {
    const timer = window.setTimeout(loadWatch, 0);
    return () => window.clearTimeout(timer);
  }, [loadWatch]);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const update = () => setNetworkQuality(qualityFromNetwork());
    connection?.addEventListener?.('change', update);
    return () => connection?.removeEventListener?.('change', update);
  }, []);

  const availableQualities = ['360p', '480p', '720p'].filter((item) => sources[item]);
  const currentSource = sources[quality];
  const sortedEpisodes = useMemo(() => [...episodes].sort((a, b) => Number(a.episode_number) - Number(b.episode_number)), [episodes]);
  const currentIndex = sortedEpisodes.findIndex((item) => Number(item.episode_number) === episodeNumber);
  const previous = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? sortedEpisodes[currentIndex + 1] : null;

  const changeEpisode = (episode) => {
    navigate(`/watch/${id}/${episode.episode_number}?streaming=${encodeURIComponent(episode.streaming || '')}`);
  };

  const changeQuality = (nextQuality) => {
    const player = videoRef.current;
    const savedTime = player?.currentTime || 0;
    setQuality(nextQuality);
    window.setTimeout(() => {
      if (videoRef.current && savedTime > 0) {
        videoRef.current.currentTime = savedTime;
        videoRef.current.play().catch(() => {});
      }
    }, 80);
  };

  const share = async () => {
    const data = { title: info?.title || 'DrakorKu', text: `Tonton ${info?.title || 'drama ini'} di DrakorKu`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      setNotice('Tautan berhasil disalin.');
    } catch {
      setNotice('Bagikan dibatalkan.');
    }
    window.setTimeout(() => setNotice(''), 2500);
  };

  const resumeKey = `drakorku:progress:${id}:${episodeNumber}`;
  const restoreProgress = () => {
    const saved = Number(window.localStorage.getItem(resumeKey));
    if (saved > 5 && videoRef.current) videoRef.current.currentTime = saved;
  };

  return (
    <section className="min-h-screen bg-[#070912] pb-16">
      <div className="border-b border-white/[0.08] bg-[#070912]/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center px-4 py-3 sm:px-7">
          <Link to={`/drakor/${id}`} className="inline-flex justify-self-start items-center gap-1.5 text-sm font-semibold text-slate-300 transition hover:text-white"><ChevronLeft size={18} /> <span className="hidden sm:inline">Kembali ke detail</span></Link>
          <div className="min-w-0 text-center"><p className="truncate text-sm font-bold text-white">{info?.title || 'Memuat judul...'}</p><p className="mt-0.5 text-xs font-semibold text-lime-300">Episode {episodeNumber}</p></div>
          <button onClick={share} className="grid h-9 w-9 justify-self-end place-items-center rounded-lg text-slate-300 transition hover:bg-white/[0.08] hover:text-white" aria-label="Bagikan episode"><Share2 size={17} /></button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-7 sm:pt-8">
        <div className="overflow-hidden rounded-2xl border border-white/[0.10] bg-black shadow-2xl shadow-black/30">
          <div className="relative aspect-video">
            {loading ? <div className="absolute inset-0 grid place-items-center"><div className="text-center"><span className="spinner mx-auto" /><p className="mt-3 text-sm text-slate-400">Menyiapkan episode...</p></div></div> : error ? (
              <div className="absolute inset-0 grid place-items-center p-6 text-center"><div><p className="text-lg font-bold text-white">Belum bisa memutar episode ini</p><p className="mt-2 max-w-md text-sm text-slate-400">{error}</p><div className="mt-5 flex justify-center gap-3"><button onClick={loadWatch} className="button-primary">Muat ulang</button><Link to={`/drakor/${id}`} className="button-ghost">Kembali</Link></div></div></div>
            ) : currentSource ? (
              <video ref={videoRef} key={`${id}-${episodeNumber}-${quality}`} controls autoPlay poster={info?.image} onLoadedMetadata={restoreProgress} onTimeUpdate={(event) => { if (Math.floor(event.currentTarget.currentTime) % 5 === 0) window.localStorage.setItem(resumeKey, String(event.currentTarget.currentTime)); }} className="h-full w-full bg-black object-contain">
                <source src={currentSource} />
                Browser kamu tidak mendukung pemutar video.
              </video>
            ) : <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">Sumber video tidak tersedia.</div>}
          </div>
        </div>

        {!loading && !error && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Wifi size={14} className="text-lime-300" /> Kualitas disarankan: <strong className="text-slate-200">{networkQuality}</strong></div>
          <div className="flex flex-wrap gap-2">{availableQualities.map((item) => <button key={item} onClick={() => changeQuality(item)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${quality === item ? 'bg-lime-300 text-slate-950' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.11]'}`}>{item}</button>)}</div>
        </div>}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div><p className="section-kicker">Sedang diputar</p><h1 className="mt-2 text-2xl font-black tracking-tight text-white">{info?.title || 'Episode'}</h1><p className="mt-1 text-sm text-slate-400">Episode {episodeNumber} · {quality}</p></div>
              <div className="flex gap-2">
                {previous && <button onClick={() => changeEpisode(previous)} className="button-ghost px-3 py-2 text-sm"><ChevronLeft size={16} /> <span className="hidden sm:inline">Ep {previous.episode_number}</span></button>}
                {next && <button onClick={() => changeEpisode(next)} className="button-primary px-3 py-2 text-sm"><span className="hidden sm:inline">Ep {next.episode_number}</span><ChevronRight size={16} /></button>}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Pilih episode</p>
              {sortedEpisodes.length ? <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">{sortedEpisodes.map((item) => <button key={`${item.episode_number}-${item.streaming || ''}`} onClick={() => changeEpisode(item)} className={`rounded-xl py-2.5 text-xs font-bold transition ${Number(item.episode_number) === episodeNumber ? 'bg-lime-300 text-slate-950' : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.11] hover:text-white'}`}>{item.episode_number}</button>)}</div> : <p className="mt-3 text-sm text-slate-500">Daftar episode belum tersedia.</p>}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="surface-card p-5"><div className="flex items-center gap-2 text-white"><Settings2 size={17} className="text-lime-300" /><h2 className="font-bold">Unduh episode</h2></div><p className="mt-2 text-sm leading-6 text-slate-400">Pilih kualitas untuk membuka sumber video di tab baru.</p><div className="mt-4 grid gap-2">{availableQualities.map((item) => <a key={item} href={sources[item]} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3.5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1]"><span>{item}</span><span className="flex items-center gap-1 text-xs text-lime-300"><Download size={14} /> Buka <ExternalLink size={12} /></span></a>)}</div></div>
            <div className="surface-card p-5"><button onClick={() => setShowSupport((value) => !value)} className="flex w-full items-center justify-between text-left"><span className="flex items-center gap-2 font-bold text-white"><Coffee size={17} className="text-lime-300" /> Dukung DrakorKu</span><ChevronRight size={16} className={`text-slate-400 transition ${showSupport ? 'rotate-90' : ''}`} /></button>{showSupport && <div className="mt-4 border-t border-white/[0.08] pt-4"><img src={qrisImage} alt="Kode QR dukungan DrakorKu" className="mx-auto w-40 rounded-xl bg-white p-2" /><p className="mt-3 text-center text-xs leading-5 text-slate-400">Jika aplikasi ini bermanfaat, kamu dapat memberikan dukungan melalui QRIS.</p></div>}</div>
          </aside>
        </div>
      </div>
      {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl">{notice}</div>}
    </section>
  );
}
