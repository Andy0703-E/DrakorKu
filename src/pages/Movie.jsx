import BrowsePage from '../components/BrowsePage';
import { fetchMovieDrakor } from '../api/config';

export default function Movie() {
  return <BrowsePage eyebrow="Tonton sekali duduk" title="Korean movie" description="Pilih film Korea untuk teman waktu senggangmu." fetcher={fetchMovieDrakor} emptyTitle="Belum ada movie" emptyDescription="Katalog film akan muncul di sini saat tersedia." />;
}
