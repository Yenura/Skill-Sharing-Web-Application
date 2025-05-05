import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  type: 'recipe' | 'community' | 'user';
  title: string;
  description?: string;
  image?: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');
    
    switch (result.type) {
      case 'recipe':
        router.push(`/recipe/${result.id}`);
        break;
      case 'community':
        router.push(`/community/${result.id}`);
        break;
      case 'user':
        router.push(`/profile/${result.id}`);
        break;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search recipes, communities, or users..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {showResults && (query.trim() || loading) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                >
                  {result.image && (
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={result.image}
                        alt={result.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <span className="text-xs text-gray-500 capitalize">
                        {result.type}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {result.description}
                      </p>
                    )}
                    {result.author && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="relative h-4 w-4">
                          <Image
                            src={result.author.avatar}
                            alt={result.author.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {result.author.name}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
} 