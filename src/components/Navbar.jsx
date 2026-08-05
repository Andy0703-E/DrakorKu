import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Menu, Play, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getWatchlist } from '../utils/watchlist';

const links = [
  ['/', 'Beranda'],
  ['/ongoing', 'Ongoing'],
  ['/recommended', 'Pilihan'],
  ['/movie', 'Movie'],
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getWatchlist().length);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const refreshCount = () => setSavedCount(getWatchlist().length);
    window.addEventListener('watchlist:changed', refreshCount);
    return () => window.removeEventListener('watchlist:changed', refreshCount);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setOpen(false);
  };

  return (
    <nav className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="DrakorKu, beranda">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-300 text-slate-950 shadow-[0_0_24px_rgba(190,242,100,0.23)]"><Play size={17} fill="currentColor" /></span>
          <span className="text-lg font-black tracking-[-0.06em] text-white sm:text-xl">drakor<span className="text-lime-300">ku</span><sup className="ml-1 text-[8px] tracking-normal text-slate-500">ID</sup></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([to, label]) => <Link key={to} to={to} className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${location.pathname === to ? 'bg-white/[0.09] text-white' : 'text-slate-400 hover:text-white'}`}>{label}</Link>)}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <form onSubmit={handleSearch} className="search-shell">
            <Search size={16} />
            <input type="search" placeholder="Cari drama" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Cari drama" />
          </form>
          <Link to="/my-list" className={`relative grid h-10 w-10 place-items-center rounded-xl border transition ${location.pathname === '/my-list' ? 'border-lime-300/60 bg-lime-300 text-slate-950' : 'border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/30 hover:bg-white/[0.08]'}`} aria-label="Daftar saya">
            <Bookmark size={17} fill={location.pathname === '/my-list' ? 'currentColor' : 'none'} />
            {savedCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{savedCount > 9 ? '9+' : savedCount}</span>}
          </Link>
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="app-header-menu lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {links.map(([to, label]) => <Link key={to} onClick={() => setOpen(false)} to={to} className={`rounded-xl px-4 py-3 text-sm font-semibold ${location.pathname === to ? 'bg-lime-300 text-slate-950' : 'bg-white/[0.05] text-slate-300'}`}>{label}</Link>)}
            <Link onClick={() => setOpen(false)} to="/my-list" className="rounded-xl bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-300">Daftar saya {savedCount ? `(${savedCount})` : ''}</Link>
          </div>
          <form onSubmit={handleSearch} className="search-shell mt-2 w-full">
            <Search size={16} />
            <input type="search" placeholder="Cari judul drama" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Cari drama" />
          </form>
        </div>
      )}
    </nav>
  );
}
