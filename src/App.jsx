import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Detail = lazy(() => import('./pages/Detail'));
const Watch = lazy(() => import('./pages/Watch'));
const Ongoing = lazy(() => import('./pages/Ongoing'));
const Recommended = lazy(() => import('./pages/Recommended'));
const Movie = lazy(() => import('./pages/Movie'));
const Search = lazy(() => import('./pages/Search'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ongoing" element={<Ongoing />} />
              <Route path="/recommended" element={<Recommended />} />
              <Route path="/movie" element={<Movie />} />
              <Route path="/drakor/:id" element={<Detail />} />
              <Route path="/watch/:id/:ep" element={<Watch />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Suspense>
        </main>
        
        <footer className="border-t border-white/5 py-12 mt-20">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} DrakorKu. Create by Andi Agung . All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
