import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Play, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${query}`);
      setOpen(false);
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 px-4 md:px-6 py-4">
      <div className="container mx-auto flex items-center justify-between max-w-[1400px] relative">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Play className="text-white fill-current" size={18} />
          </div>

          <span className="text-lg md:text-2xl font-bold text-white">
            DRAKOR<span className="text-primary">KU</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className={`transition-colors duration-200 ${location.pathname === '/' ? 'text-white font-bold' : 'text-gray-400 hover:text-primary font-medium'}`}>Beranda</Link>
          <Link to="/ongoing" className={`transition-colors duration-200 ${location.pathname === '/ongoing' ? 'text-white font-bold' : 'text-gray-400 hover:text-primary font-medium'}`}>Ongoing</Link>
          <Link to="/recommended" className={`transition-colors duration-200 ${location.pathname === '/recommended' ? 'text-white font-bold' : 'text-gray-400 hover:text-primary font-medium'}`}>Recommended</Link>
          <Link to="/movie" className={`transition-colors duration-200 ${location.pathname === '/movie' ? 'text-white font-bold' : 'text-gray-400 hover:text-primary font-medium'}`}>Movie</Link>
        </div>

        {/* SEARCH DESKTOP */}
        <div className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-2 border border-transparent focus-within:border-primary/50 focus-within:bg-white/20 transition-all group">
          <input
            type="text"
            placeholder="Cari drama..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-transparent outline-none text-sm w-40 md:w-64 text-white placeholder-gray-400"
          />
          <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors cursor-pointer" onClick={() => { if(query.trim()) { navigate(`/search?q=${query}`); setOpen(false); } }} />
        </div>

        {/* HAMBURGER MOBILE */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-4 space-y-4 px-2">

          <div className="flex flex-col gap-3">
            <Link onClick={() => setOpen(false)} to="/">Beranda</Link>
            <Link onClick={() => setOpen(false)} to="/ongoing">Ongoing</Link>
            <Link onClick={() => setOpen(false)} to="/recommended">Recommended</Link>
            <Link onClick={() => setOpen(false)} to="/movie">Movie</Link>
          </div>

          {/* SEARCH MOBILE */}
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Cari drama..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none text-sm w-full"
            />
            <Search size={18} className="text-gray-400 ml-2" />
          </div>

        </div>
      )}
    </nav>
  );
}