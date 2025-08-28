import React, { useEffect } from 'react';
import { usePages } from '../contexts/PagesContext';
import { Shield, Users, Target, Award, Download, FileText, MapPin, Calendar, CheckCircle } from 'lucide-react';
import type { Page, PageSection } from '../types';

interface DynamicPageRendererProps {
  slug: string;
}

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ slug }) => {
  const { getPageBySlug, getSectionsByPageId, incrementPageView } = usePages();
  const page = getPageBySlug(slug);

  useEffect(() => {
    if (page) {
      incrementPageView(page.id);
    }
  }, [page, incrementPageView]);

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const sections = getSectionsByPageId(page.id);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className="bg-blue-950 text-white py-20">
            <div className="container mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {section.title || page.hero_title || page.title}
              </h1>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                {section.content || page.hero_subtitle || page.meta_description}
              </p>
            </div>
          </section>
        );

      case 'content':
        return (
          <section key={section.id} className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              {section.title && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
                </div>
              )}
              <div className="max-w-4xl mx-auto prose prose-lg">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          </section>
        );

      case 'cards':
        const cardsData = section.data?.cards || [];
        return (
          <section key={section.id} className="py-16 bg-white">
            <div className="container mx-auto px-6">
              {section.title && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cardsData.map((card: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{card.title}</h3>
                    <p className="text-gray-600 text-center">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'stats':
        const statsData = section.data?.stats || [];
        return (
          <section key={section.id} className="py-16 bg-blue-950 text-white">
            <div className="container mx-auto px-6">
              {section.title && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                  <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-8">
                {statsData.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-950">{stat.value}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                    <p className="text-gray-300">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'grid':
        const gridData = section.data?.items || [];
        return (
          <section key={section.id} className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              {section.title && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gridData.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <span className="text-blue-600 text-sm font-medium">{item.count} Items</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'accordion':
        const accordionData = section.data?.items || [];
        return (
          <section key={section.id} className="py-16 bg-white">
            <div className="container mx-auto px-6">
              {section.title && (
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
                </div>
              )}
              <div className="max-w-4xl mx-auto space-y-4">
                {accordionData.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border">
                    <div className="bg-gray-100 p-6 cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <CheckCircle className="text-gray-600" size={20} />
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <p className="text-gray-600">{item.description}</p>
                      {item.tags && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render hero section if page has hero data */}
      {(page.hero_title || page.hero_subtitle) && (
        <section className="bg-blue-950 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {page.hero_title || page.title}
            </h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
            {page.hero_subtitle && (
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                {page.hero_subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Render page sections */}
      {sections.map(renderSection)}

      {/* Default content if no sections */}
      {sections.length === 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DynamicPageRenderer;