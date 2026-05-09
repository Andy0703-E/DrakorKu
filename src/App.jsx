import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Watch from './pages/Watch';
import Ongoing from './pages/Ongoing';
import Recommended from './pages/Recommended';
import Movie from './pages/Movie';
import Search from './pages/Search';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ongoing" element={<Ongoing />} />
            <Route path="/recommended" element={<Recommended />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/drakor/:id" element={<Detail />} />
            <Route path="/watch/:id/:ep" element={<Watch />} />
            <Route path="/search" element={<Search />} />
          </Routes>
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
