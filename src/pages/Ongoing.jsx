import BrowsePage from '../components/BrowsePage';
import { fetchOngoingDrakor } from '../api/config';

export default function Ongoing() {
  return <BrowsePage eyebrow="Sedang tayang" title="Drama ongoing" description="Ikuti episode terbaru dari serial yang sedang berjalan." fetcher={fetchOngoingDrakor} emptyTitle="Belum ada drama ongoing" emptyDescription="Katalog ini akan diperbarui saat ada judul baru." />;
}
