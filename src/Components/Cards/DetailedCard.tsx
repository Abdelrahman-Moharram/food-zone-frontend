import { Link } from "react-router-dom";

interface DetailedCardType {
  id            : string;
  title         : string;
  isActive      : boolean;
  updatedAt     : string;
  subCount      : number;
}



const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-4 w-36 rounded-md bg-border/40" />
      <div className="h-5 w-16 rounded-full bg-border/40" />
    </div>
    <div className="h-3 w-24 rounded bg-border/30 mb-6" />
    <div className="flex items-center justify-between pt-4 border-t border-border/50">
      <div className="h-3 w-24 rounded bg-border/30" />
      <div className="h-3 w-16 rounded bg-border/30" />
    </div>
  </div>
);


const DetailedCard = ({ page }: { page: DetailedCardType }) => {
  const updatedAt = new Date(page.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link to={`/dashboard/pages/${page.id}`} className="card group block">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3
          className="text-sm font-semibold leading-snug transition-colors duration-200"
          style={{ color: 'rgba(var(--copy-primary))' }}
        >
          {page.title}
        </h3>

        <span
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={page.isActive ? {
            background: 'rgba(var(--primary), 0.12)',
            color: 'rgba(var(--primary))',
          } : {
            background: 'rgba(var(--border), 0.4)',
            color: 'rgba(var(--copy-secondary))',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: page.isActive ? 'rgba(var(--primary))' : 'rgba(var(--copy-secondary))' }}
          />
          {page.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Sections count */}
      <p
        className="text-xs mb-5"
        style={{ color: 'rgba(var(--copy-secondary))' }}
      >
        {page.subCount === 0
          ? 'No sections yet'
          : `${page.subCount} section${page.subCount !== 1 ? 's' : ''}`}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-4 border-t"
        style={{ borderColor: 'rgba(var(--border))' }}
      >
        <span
          className="text-[11px]"
          style={{ color: 'rgba(var(--copy-secondary), 0.7)' }}
        >
          Updated {updatedAt}
        </span>

        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium transition-all duration-200"
          style={{ color: 'rgba(var(--primary))' }}
        >
          Manage
          <svg
            className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
            viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default DetailedCard