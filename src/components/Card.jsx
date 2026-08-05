import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Check, Play } from 'lucide-react';
import { isSaved, toggleWatchlist } from '../utils/watchlist';

export default function Card({ data }) {
  const [saved, setSaved] = useState(() => isSaved(data.id));
  const [imageBroken, setImageBroken] = useState(false);
  const thumbnail = data.image || data.thumb;
  const title = data.title || 'Untitled';
  const status = data.status || (data.tipe === '1' ? 'Movie' : 'Series');

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSaved(toggleWatchlist(data));
  };

  return (
    <article className="poster-card group relative">
      <Link to={`/drakor/${data.id}`} className="block" aria-label={`Buka detail ${title}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        {thumbnail && !imageBroken ? (
          <img
            src={thumbnail}
            alt={`Poster ${title}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageBroken(true)}
          />
        ) : (
          <div className="flex h-full items-end bg-[radial-gradient(circle_at_top,#394569,transparent_55%),linear-gradient(145deg,#192033,#070a12)] p-4">
            <p className="text-lg font-black leading-tight text-white/80">{title}</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070912] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="inline-flex rounded-full border border-white/15 bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-100 backdrop-blur">{status}</span>
          <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-white transition group-hover:text-lime-200 sm:text-[15px]">{title}</h3>
          {data.date && <p className="mt-1 text-xs text-slate-300">{data.date}</p>}
        </div>
        <div className="absolute inset-0 grid place-items-center bg-slate-950/30 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-lime-300 text-slate-950 shadow-lg shadow-lime-300/20"><Play size={18} fill="currentColor" /></span>
        </div>
      </div>
      </Link>
      <button
        type="button"
        onClick={handleSave}
        aria-label={saved ? `Hapus ${title} dari daftar saya` : `Simpan ${title} ke daftar saya`}
        className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition ${saved ? 'border-lime-300/70 bg-lime-300 text-slate-950' : 'border-white/20 bg-slate-950/55 text-white hover:border-white/50 hover:bg-slate-950/80'}`}
      >
        {saved ? <Check size={16} strokeWidth={3} /> : <Bookmark size={16} />}
      </button>
    </article>
  );
}
