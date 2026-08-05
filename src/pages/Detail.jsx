import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, CalendarDays, Check, ChevronLeft, ChevronRight, Eye, Film, Play, Tv } from 'lucide-react';
import { fetchDrakorInfo, fetchEpisodes } from '../api/config';
import { EmptyState } from '../components/PosterGrid';
import { isSaved, toggleWatchlist } from '../utils/watchlist';

function asItems(response) {
  return Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
}

function asObject(response) {
  return response?.data && !Array.isArray(response.data) ? response.data : response || null;
}

function synopsis(value) {
  if (!value) return 'Sinopsis belum tersedia untuk judul ini.';
  const cleaned = value.replace(/\r/g, '').replace(/&nbsp;/gi, ' ').trim();
  const section = cleaned.split(/Sinopsis/i)[1] || cleaned;
  return section.replace(/Details/gi, '').replace(/\s+/g, ' ').trim();
}

function formattedNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
}

export default function Detail() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(() => isSaved(id));

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [infoResult, episodeResult] = await Promise.all([fetchDrakorInfo(id), fetchEpisodes(id)]);
      const nextInfo = asObject(infoResult);
      if (!nextInfo || nextInfo.status === 0) throw new Error('not found');
      setInfo(nextInfo);
      setEpisodes(asItems(episodeResult));
      setSaved(isSaved(nextInfo.id || id));
    } catch {
      setError('Detail drama belum dapat dimuat. Judul ini mungkin sudah tidak tersedia.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(loadDetail, 0);
    return () => window.clearTimeout(timer);
  }, [loadDetail]);

  const sortedEpisodes = useMemo(() => [...episodes].sort((a, b) => Number(a.episode_number) - Number(b.episode_number)), [episodes]);
  const firstEpisode = sortedEpisodes[0];
  const categories = (info?.category || '').split(',').map((item) => item.trim()).filter(Boolean).slice(0, 4);
  const title = info?.title || 'Drama';

  const saveTitle = () => {
    if (!info) return;
    setSaved(toggleWatchlist(info));
  };

  if (loading) {
    return <div className="page-shell"><div className="h-[480px] animate-pulse rounded-3xl bg-white/[0.05]" /></div>;
  }

  if (error || !info) {
    return <section className="page-shell"><EmptyState title="Drama tidak tersedia" description={error} action={<button onClick={loadDetail} className="button-secondary">Coba lagi</button>} /></section>;
  }

  return (
    <>
      <section className="detail-hero">
        {info.image && <img className="detail-hero-image" src={info.image} alt="" />}
        <div className="detail-hero-shade" />
        <div className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 lg:px-12 lg:pb-16">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition hover:text-white"><ChevronLeft size={17} /> Kembali ke katalog</Link>
          <div className="mt-12 flex flex-col gap-7 sm:flex-row sm:items-end lg:mt-20">
            <div className="mx-auto w-40 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl sm:mx-0 sm:w-52 lg:w-60">
              {info.image ? <img src={info.image} alt={`Poster ${title}`} className="aspect-[2/3] w-full object-cover" /> : <div className="aspect-[2/3] bg-slate-800" />}
            </div>
            <div className="max-w-3xl text-center sm:text-left">
              <p className="section-kicker">{info.tipe === '1' ? <><Film size={14} /> Movie</> : <><Tv size={14} /> Series</>}</p>
              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                {info.date && <span className="meta-pill"><CalendarDays size={14} /> {info.date}</span>}
                {categories.slice(0, 2).map((category) => <span key={category} className="meta-pill">{category}</span>)}
              </div>
              <p className="mt-5 line-clamp-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">{synopsis(info.shoot)}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
                {firstEpisode ? <Link to={`/watch/${id}/${firstEpisode.episode_number}?streaming=${encodeURIComponent(firstEpisode.streaming || '')}`} className="button-primary"><Play size={17} fill="currentColor" /> Mulai nonton</Link> : <button disabled className="button-primary cursor-not-allowed opacity-50"><Play size={17} /> Episode belum tersedia</button>}
                <button onClick={saveTitle} className="button-ghost">{saved ? <Check size={17} /> : <Bookmark size={17} />} {saved ? 'Tersimpan' : 'Simpan ke daftar'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div><p className="section-kicker">Pilih episode</p><h2 className="mt-2 text-2xl font-black tracking-tight text-white">Daftar episode</h2></div>
            {sortedEpisodes.length > 0 && <span className="text-sm text-slate-400">{sortedEpisodes.length} episode</span>}
          </div>
          {sortedEpisodes.length ? (
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
              {sortedEpisodes.map((episode) => (
                <Link key={`${episode.episode_number}-${episode.streaming || ''}`} to={`/watch/${id}/${episode.episode_number}?streaming=${encodeURIComponent(episode.streaming || '')}`} className="episode-row group">
                  <span className="episode-number">{episode.episode_number}</span>
                  <span className="font-semibold text-slate-100">Episode {episode.episode_number}</span>
                  <span className="ml-auto text-sm text-slate-500 group-hover:text-lime-200">Tonton</span>
                  <ChevronRight size={17} className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-lime-200" />
                </Link>
              ))}
            </div>
          ) : <EmptyState title="Episode belum tersedia" description="Kami akan menampilkan episode di sini begitu sumbernya tersedia." />}
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="section-kicker">Tentang judul ini</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3"><dt className="text-slate-500">Tipe</dt><dd className="font-semibold text-white">{info.tipe === '1' ? 'Movie' : 'Series'}</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="flex items-center gap-1 text-slate-500"><Eye size={14} /> Dilihat</dt><dd className="font-semibold text-white">{formattedNumber(info.hits)}</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="text-slate-500">Favorit</dt><dd className="font-semibold text-white">{formattedNumber(info.jumlah_favorit)}</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="text-slate-500">Update</dt><dd className="font-semibold text-white">{info.date || '-'}</dd></div>
          </dl>
          {categories.length > 2 && <div className="mt-7 border-t border-white/[0.08] pt-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Kategori</p><div className="mt-3 flex flex-wrap gap-2">{categories.map((category) => <span key={category} className="meta-pill">{category}</span>)}</div></div>}
        </aside>
      </section>
    </>
  );
}
