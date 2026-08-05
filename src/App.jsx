import { BrowserRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Bookmark, House, Play, Search as SearchIcon } from 'lucide-react';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Detail = lazy(() => import('./pages/Detail'));
const Watch = lazy(() => import('./pages/Watch'));
const Ongoing = lazy(() => import('./pages/Ongoing'));
const Recommended = lazy(() => import('./pages/Recommended'));
const Movie = lazy(() => import('./pages/Movie'));
const Search = lazy(() => import('./pages/Search'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return <div className="grid min-h-[55vh] place-items-center"><span className="spinner" aria-label="Memuat halaman" /></div>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.07] bg-[#06070e]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div><Link to="/" className="inline-flex items-center gap-2 text-lg font-black tracking-[-0.05em] text-white"><span className="grid h-7 w-7 place-items-center rounded-lg bg-lime-300 text-slate-950"><Play size={13} fill="currentColor" /></span> drakor<span className="text-lime-300">ku</span></Link><p className="mt-2 text-sm text-slate-500">Temukan tontonan Asia favoritmu dengan lebih mudah.</p></div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-400"><Link to="/ongoing" className="hover:text-white">Ongoing</Link><Link to="/recommended" className="hover:text-white">Pilihan</Link><Link to="/movie" className="hover:text-white">Movie</Link><Link to="/my-list" className="hover:text-white">Daftar saya</Link></div>
        <p className="text-xs text-slate-500">Temukan cerita yang ingin kamu tonton.</p>
      </div>
    </footer>
  );
}

function MobileDock() {
  const { pathname } = useLocation();
  const items = [
    ['/', 'Beranda', House],
    ['/search', 'Cari', SearchIcon],
    ['/my-list', 'Daftar', Bookmark],
  ];

  return (
    <nav className="mobile-dock" aria-label="Navigasi utama">
      {items.map(([to, label, Icon]) => {
        const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
        return <Link key={to} to={to} className={`mobile-dock-item ${active ? 'is-active' : ''}`}><Icon size={19} fill={active && Icon === Bookmark ? 'currentColor' : 'none'} /><span>{label}</span></Link>;
      })}
    </nav>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070912] text-white">
      <ScrollToTop />
      <Navbar />
      <main className="pb-20 md:pb-0"><Suspense fallback={<Loading />}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ongoing" element={<Ongoing />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/my-list" element={<Watchlist />} />
        <Route path="/drakor/:id" element={<Detail />} />
        <Route path="/watch/:id/:ep" element={<Watch />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></main>
      <Footer />
      <MobileDock />
    </div>
  );
}

export default function App() {
  return <Router><AppLayout /></Router>;
}
