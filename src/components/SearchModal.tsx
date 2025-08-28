import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Newspaper, Users, Calendar, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { usePages } from '../contexts/PagesContext';
import { Link } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'news' | 'page' | 'resource' | 'gallery';
  url: string;
  image?: string;
  date?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { news, gallery } = useData();
  const { pages, resources } = usePages();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    const searchResults: SearchResult[] = [];

    // Search news
    news
      .filter(item => item.status === 'published')
      .forEach(item => {
        if (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.content || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          searchResults.push({
            id: item.id,
            title: item.title,
            description: item.excerpt || 'No description available',
            type: 'news',
            url: '/news-portal',
            image: item.image,
            date: item.date
          });
        }
      });

    // Search pages
    pages
      .filter(page => page.status === 'published')
      .forEach(page => {
        if (
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (page.meta_description || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          searchResults.push({
            id: page.id,
            title: page.title,
            description: page.meta_description || 'No description available',
            type: 'page',
            url: `/${page.slug}`,
            image: page.hero_image
          });
        }
      });

    // Search resources
    resources
      .filter(resource => resource.status === 'published')
      .forEach(resource => {
        if (
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          searchResults.push({
            id: resource.id,
            title: resource.title,
            description: resource.description,
            type: 'resource',
            url: '/resources'
          });
        }
      });

    // Search gallery
    gallery
      .filter(item => item.status === 'published')
      .forEach(item => {
        if (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.location || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          searchResults.push({
            id: item.id,
            title: item.title,
            description: item.description || 'No description available',
            type: 'gallery',
            url: '/gallery',
            image: item.image,
            date: item.date
          });
        }
      });

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
    setLoading(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper className="text-blue-600" size={20} />;
      case 'page': return <FileText className="text-green-600" size={20} />;
      case 'resource': return <FileText className="text-purple-600" size={20} />;
      case 'gallery': return <Users className="text-orange-600" size={20} />;
      default: return <FileText className="text-gray-600" size={20} />;
    }
  };

  const handleResultClick = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search news, pages, resources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching...</p>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No results found for "{query}"</p>
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-6 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Type at least 2 characters to search</p>
            </div>
          )}

          {results.map((result) => (
            <Link
              key={result.id}
              to={result.url}
              onClick={handleResultClick}
              className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{result.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{result.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                      {result.type}
                    </span>
                    {result.date && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {result.image && (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

        {results.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Showing {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;