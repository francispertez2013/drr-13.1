import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar } from 'lucide-react';

const News: React.FC = () => {
  const { news } = useData();
  const publishedNews = news.filter(article => article.status === 'published');

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">News & Updates</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Stay informed with the latest news, announcements, and events from the Municipality of Pio Duran.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedNews.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-blue-900 font-semibold mb-2">
                  <Calendar size={16} className="mr-2" />
                  {new Date(article.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">By {article.author}</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;