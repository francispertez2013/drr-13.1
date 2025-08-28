export const generateMetaTags = (page: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}) => {
  const baseUrl = window.location.origin;
  const fullTitle = page.title.includes('MDRRMO') ? page.title : `${page.title} | MDRRMO Pio Duran`;
  
  return {
    title: fullTitle,
    description: page.description,
    keywords: page.keywords || 'MDRRMO, disaster management, emergency response, Pio Duran, Albay',
    image: page.image || `${baseUrl}/logo.png`,
    url: page.url || window.location.href,
    type: 'website'
  };
};

export const generateStructuredData = (type: 'organization' | 'article' | 'event', data: any) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type === 'organization' ? 'GovernmentOrganization' : type === 'article' ? 'Article' : 'Event'
  };

  switch (type) {
    case 'organization':
      return {
        ...baseData,
        name: 'Municipal Disaster Risk Reduction and Management Office',
        alternateName: 'MDRRMO Pio Duran',
        description: 'Municipal Disaster Risk Reduction and Management Office of Pio Duran, Albay',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Municipal Hall',
          addressLocality: 'Pio Duran',
          addressRegion: 'Albay',
          addressCountry: 'Philippines'
        },
        telephone: '911',
        email: 'mdrrmo@pioduran.gov.ph',
        url: window.location.origin,
        logo: `${window.location.origin}/logo.png`
      };

    case 'article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Organization',
          name: 'MDRRMO Pio Duran'
        },
        publisher: {
          '@type': 'Organization',
          name: 'MDRRMO Pio Duran',
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.png`
          }
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified
      };

    default:
      return baseData;
  }
};