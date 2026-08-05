import BrowsePage from '../components/BrowsePage';
import { fetchRecommendedDrakor } from '../api/config';

export default function Recommended() {
  return <BrowsePage eyebrow="Kurasi DrakorKu" title="Pilihan untukmu" description="Koleksi drama yang layak masuk daftar tontonan berikutnya." fetcher={fetchRecommendedDrakor} emptyTitle="Belum ada rekomendasi" emptyDescription="Coba kembali lagi nanti untuk pilihan terbaru." />;
}
