import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="page-shell flex min-h-[68vh] items-center justify-center text-center">
      <div>
        <p className="section-kicker">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Halaman tidak ditemukan.</h1>
        <p className="mx-auto mt-4 max-w-md text-slate-400">Mungkin tautannya sudah berubah atau halaman yang kamu cari memang belum ada.</p>
        <Link to="/" className="button-primary mt-8"><ArrowLeft size={17} /> Kembali ke beranda</Link>
      </div>
    </section>
  );
}
