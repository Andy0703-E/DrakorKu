import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, CheckCircle2, CirclePlay, Clapperboard, Play } from 'lucide-react';
import { fetchDrakorList } from '../api/config';
import Card from '../components/Card';
import { EmptyState, PosterSkeleton } from '../components/PosterGrid';

const fallbackFeature = {
  id: null,
  title: 'Cerita baru untuk malam ini.',
  image: '',
  category: 'Drama Korea, Romance, Pilihan editor',
  date: 'Update setiap hari',
  meta_description: 'Temukan drama Korea, movie, dan serial Asia dalam katalog yang dikurasi untuk waktu nontonmu.',
};

const discoveryLinks = [
  { to: '/ongoing', label: 'Sedang tayang', note: 'Episode baru', tone: 'from-lime-300/25 to-lime-300/0' },
  { to: '/recommended', label: 'Pilihan editor', note: 'Wajib masuk list', tone: 'from-violet-400/25 to-violet-400/0' },
  { to: '/movie', label: 'Movie night', note: 'Sekali duduk', tone: 'from-orange-300/25 to-orange-300/0' },
];

function getItems(response) {
  return Array.isArray(response?.data) ? response.data : [];
}

function createSummary(feature) {
  const source = feature.meta_description || feature.shoot || fallbackFeature.meta_description;
  return source.replace(/\s+/g, ' ').trim().slice(0, 180).replace(/[,.\s]+$/, '') + '.';
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHome = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchDrakorList(1);
      setItems(getItems(response));
    } catch {
      setError('Katalog belum dapat dimuat. Silakan coba lagi dalam beberapa saat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadHome, 0);
    return () => window.clearTimeout(timer);
  }, [loadHome]);

  const feature = items[0] || fallbackFeature;
  const catalogue = items.slice(1);
  const hasFeature = Boolean(items[0]?.id);
  const featureLink = hasFeature ? `/drakor/${feature.id}` : '/ongoing';
  const category = (feature.category || '').split(',').filter(Boolean).slice(0, 2).join(' · ') || 'Pilihan DrakorKu';

  return (
    <>
      <section className="home-hero">
        <div className="hero-aurora hero-aurora-one" />
        <div className="hero-aurora hero-aurora-two" />
        <div className="home-hero-grid">
          <div className="hero-copy">
            <p className="section-kicker"><CirclePlay size={14} /> Sorotan pilihan</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,.85)]" /> Baru diperbarui</div>
            <h1 className="hero-title">{feature.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2"><span className="hero-tag">{feature.tipe === '1' ? 'Movie' : 'Drama series'}</span><span className="hero-tag hero-tag-muted">{category}</span></div>
            <p className="hero-summary">{createSummary(feature)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={featureLink} className="button-primary hero-action"><Play size={17} fill="currentColor" /> {hasFeature ? 'Mulai nonton' : 'Jelajahi katalog'}</Link>
              <Link to="/my-list" className="button-ghost"><Bookmark size={17} /> Simpan pilihan</Link>
            </div>
            <div className="hero-proof"><span><CheckCircle2 size={16} className="text-lime-300" /> Katalog diperbarui rutin</span><span><CheckCircle2 size={16} className="text-lime-300" /> Lanjutkan tontonan kapan saja</span></div>
          </div>

          <div className="feature-stage">
            <div className="feature-ambient" style={feature.image ? { backgroundImage: `url(${feature.image})` } : undefined} />
            <div className="feature-poster-wrap">
              <div className="feature-poster-glow" />
              {feature.image ? <img src={feature.image} alt={`Poster ${feature.title}`} className="feature-poster" /> : <div className="feature-poster feature-poster-placeholder" aria-label="DrakorKu pilihan malam ini"><span className="placeholder-orbit placeholder-orbit-one" /><span className="placeholder-orbit placeholder-orbit-two" /><span className="placeholder-mark"><Play size={29} fill="currentColor" /></span><span className="placeholder-word">NOW<br />PLAYING</span></div>}
              <Link to={featureLink} className="poster-play" aria-label={`Buka ${feature.title}`}><Play size={20} fill="currentColor" /></Link>
            </div>
            <div className="feature-caption"><span className="caption-eyebrow">Sedang populer</span><strong>{feature.title}</strong><span>{feature.date || 'Baru ditambahkan'}</span></div>
          </div>
        </div>
      </section>

      <section className="page-shell home-content">
        <div className="home-section-heading"><div><p className="section-kicker"><Clapperboard size={14} /> Mulai dari sini</p><h2>Temukan sesuai mood kamu.</h2></div><p>Kurasi cepat untuk menemukan tontonan tanpa harus mencari terlalu lama.</p></div>
        <div className="discovery-grid">
          {discoveryLinks.map((item, index) => <Link to={item.to} key={item.to} className="discovery-card"><div className={`discovery-wash bg-gradient-to-br ${item.tone}`} /><span className="discovery-index">0{index + 1}</span><div><h3>{item.label}</h3><p>{item.note}</p></div><ArrowRight size={18} className="discovery-arrow" /></Link>)}
        </div>

        <div className="mt-16 flex items-end justify-between gap-5 sm:mt-20">
          <div><p className="section-kicker">Pilihan terbaru</p><h2 className="catalogue-title">Baru masuk katalog</h2></div>
          <Link to="/ongoing" className="catalogue-link">Lihat semua <ArrowRight size={16} /></Link>
        </div>

        <div className="mt-7">
          {loading ? <PosterSkeleton /> : error && !catalogue.length ? (
            <EmptyState title="Katalog belum bisa dijangkau" description={error} action={<button onClick={loadHome} className="button-secondary">Coba lagi</button>} />
          ) : catalogue.length ? <div className="poster-grid">{catalogue.map((item, index) => <Card key={`${item.id}-${index}`} data={item} />)}</div> : (
            <EmptyState title="Belum ada judul baru" description="Silakan kembali lagi sebentar lagi." />
          )}
        </div>
      </section>
    </>
  );
}
