import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { to_int_or_default } from '../utils/helper';

interface Props {
  totalPages: number | null;
}

const Paginition = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = to_int_or_default(searchParams.get('page'));

  const rawPage = searchParams.get('page');
  const rawSize = searchParams.get('size');

  useEffect(() => {
    const missingPage = !rawPage;
    const missingSize = !rawSize;

    if (missingPage || missingSize) {
      const next = new URLSearchParams(searchParams);
      if (missingPage) next.set('page', '1');
      if (missingSize) next.set('size', '10');
      setSearchParams(next, { replace: true });
    }
    
  }, [rawPage, rawSize]);

  if (!totalPages || totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  const generatePages = () => {
    const pages: (number | string)[] = [];
    // const maxShown = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <button
        type='button'
        onClick={() => page > 1 && handlePageChange(page - 1)}
        disabled={page <= 1}
        className="px-2 py-1 rounded hover:bg-gray-200 disabled:text-gray-400"
      >
        &lt;
      </button>

      {pages.map((p, index) =>
        p === '...' ? (
          <span key={index} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            type='button'
            key={index}
            onClick={() => handlePageChange(p as number)}
            className={`w-8 h-8 rounded-full text-sm font-medium ${
              page === p ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type='button'
        onClick={() => page < totalPages && handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-2 py-1 rounded hover:bg-gray-200 disabled:text-gray-400"
      >
        &gt;
      </button>
    </div>
  );
};

export default Paginition;