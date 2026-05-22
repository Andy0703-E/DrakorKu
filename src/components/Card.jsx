import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function Card({ data }) {
  // Support both 'thumb' and 'image' from different API versions
  const thumbnail = data.image || data.thumb || '/placeholder.jpg';
  const title = data.title || 'Untitled';
  const status = data.status || data.type || 'Ongoing';

  return (
    <Link 
      to={`/drakor/${data.id}`} 
      className="group relative overflow-hidden rounded-xl bg-dark-accent transition-all duration-500 hover:scale-[1.03] hover-glow"
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          width="400"
          height="600"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-primary p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500">
            <Play size={24} fill="white" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4">
        <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-2 inline-block border border-primary/20">
          {status}
        </span>
        <h3 className="text-white font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
