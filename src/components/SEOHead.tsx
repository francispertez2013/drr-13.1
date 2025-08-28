import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'MDRRMO Pio Duran, Albay | Official Disaster Management & Response',
  description = 'Municipal Disaster Risk Reduction and Management Office - Building resilient communities through effective disaster preparedness and response.',
  keywords = 'MDRRMO Pio Duran, Pio Duran disaster management, Albay emergency services, Disaster preparedness, Pio Duran Emergency Response Albay, Pio Duran safety, Disaster risk reduction, Albay disaster resilience, Civil defense Pio Duran, Emergency alerts, Incident reporting Pio Duran, Disaster response team, Search and rescue Albay, First aid training, Family disaster plan, Emergency kit checklist, Evacuation routes map, Volunteer registration MDRRMO, Pio Duran news and updates, MDRRMO gallery, About MDRRMO Pio Duran, Disaster planning resources, Downloadable emergency guides, Pio Duran, Albay, Bicol region disaster management, Municipality of Pio Duran, "How to prepare for a typhoon in Pio Duran", "Latest news from MDRRMO Pio Duran", "Emergency contact numbers in Albay", "Where to find evacuation centers in Pio Duran", "How to volunteer for disaster response in Albay", "Family disaster preparedness plan template", "What to include in an emergency kit",  Agol, Alabangpuro, Banawan, Barangay I (Poblacion), Barangay II (Poblacion), Barangay III (Poblacion), Barangay IV (Poblacion), Barangay V (Poblacion), Basicao Coastal, Basicao Interior, Binodegahan, Buenavista, Buyo, Caratagan, Cuyaoyao, Flores, La Medalla, Lawinon, Macasitas, Malapay, Malidong, Mamlad, Marigondon, Matanglad, Nablangbulod, Oringon, Palapas, Panganiran, Santo Cristo, Sukip, Tibabo',
  image = 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp',
  url,
  type = 'website'
}) => {
  const fullTitle = title.includes('MDRRMO') ? title : `${title} | MDRRMO Pio Duran, Albay | Official Disaster Management & Response`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="MDRRMO Pio Duran" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MDRRMO Pio Duran" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1e3a8a" />
      <meta name="msapplication-TileColor" content="#1e3a8a" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SEOHead;