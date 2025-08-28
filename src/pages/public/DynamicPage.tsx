import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicPageRenderer from '../../components/DynamicPageRenderer';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invalid Page</h1>
          <p className="text-gray-600">No page slug provided.</p>
        </div>
      </div>
    );
  }

  return <DynamicPageRenderer slug={slug} />;
};

export default DynamicPage;