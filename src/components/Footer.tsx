import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Footer: React.FC = () => {
  const [emergencyHotlines, setEmergencyHotlines] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchHotlines();
  }, []);

  const fetchHotlines = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_hotlines')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "emergency_hotlines" does not exist')) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setEmergencyHotlines(data.map(hotline => ({
          name: hotline.contact_name,
          number: hotline.phone_number
        })));
      } else {
        // Fallback to default hotlines
        setEmergencyHotlines([
          { name: 'Office of the Mayor', number: '(052) 123-4567' },
          { name: 'MDRRMO', number: '911 / (052) 234-5678' },
          { name: 'MSWD', number: '1343' },
          { name: 'Medical/MHO', number: '(052) 345-6789' },
          { name: 'PNP', number: '117 / (052) 456-7890' },
          { name: 'BFP', number: '(052) 567-8901' },
          { name: 'PCG', number: '(052) 678-9012' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching hotlines:', error);
    }
  };

  const quickLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Programs & Services', path: '/services-detail' },
    { label: 'News & Updates', path: '/news-portal' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com/mdrrmo.pioduran', label: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com/mdrrmo_pioduran', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com/mdrrmo.pioduran', label: 'Instagram' },
    { icon: Youtube, url: 'https://youtube.com/@mdrrmo-pioduran', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white border-t-4 border-yellow-500 shadow-2xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-float stagger-3"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 relative z-10">
        
          {/* MDRRMO Contact Info */}
          <div className="text-sm animate-slide-left">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp" 
                alt="MDRRMO" 
                className="h-12 w-auto hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h2 className="text-xl font-bold text-yellow-500 hover:text-yellow-400 transition-colors">MDRRMO</h2>
                <p className="text-yellow-400">Pio Duran, Albay</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="flex items-center hover:text-yellow-200 transition-colors group">
                <MapPin className="mr-3 text-yellow-500 group-hover:scale-110 transition-transform duration-200" size={18} />
                Municipal Hall, Pio Duran, Albay
              </p>
              <p className="flex items-center hover:text-yellow-200 transition-colors group">
                <Phone className="mr-3 text-yellow-500 group-hover:scale-110 transition-transform duration-200" size={18} />
                Emergency Hotline: 911
              </p>
              <p className="flex items-center hover:text-yellow-200 transition-colors group">
                <Mail className="mr-3 text-yellow-500 group-hover:scale-110 transition-transform duration-200" size={18} />
                mdrrmo@pioduran.gov.ph
              </p>
            </div>
            <p className="mt-6 text-gray-300 leading-relaxed">
              Committed to safety and resilience in our community.
            </p>
            
            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="font-bold mb-4 text-yellow-500">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 glass-dark rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-blue-950 transition-all duration-300 hover:scale-110 hover:shadow-lg stagger-${index + 1}`}
                    title={social.label}
                  >
                    <social.icon size={16} className="hover:animate-bounce" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-sm animate-slide-up stagger-2">
            <h2 className="text-xl font-bold mb-6 text-yellow-500">Quick Links</h2>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index} className={`stagger-${index + 1}`}>
                  <Link 
                    to={link.path} 
                    className="hover:text-yellow-400 transition-all duration-300 flex items-center group hover:transform hover:translate-x-2"
                  >
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Hotline Numbers */}
          <div className="text-sm animate-slide-up stagger-3">
            <h2 className="text-xl font-bold mb-6 text-yellow-500">Emergency Hotlines</h2>
            <ul className="space-y-3">
              {emergencyHotlines.map((hotline, index) => (
                <li key={index} className={`flex flex-col group stagger-${index + 1}`}>
                  <span className="text-gray-300">{hotline.name}</span>
                  <a 
                    href={`tel:${hotline.number.replace(/[^\d]/g, '')}`} 
                    className="text-yellow-500 hover:text-yellow-300 font-bold transition-all duration-300 group-hover:scale-105 transform"
                  >
                    {hotline.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Google Map Embed */}
          <div className="animate-slide-right stagger-4">
            <h2 className="text-xl font-bold mb-6 text-yellow-500">Find Us</h2>
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d627.0440762880165!2d123.455991!3d13.044111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a01dcb8f5dc12d%3A0xf32c415c60d3f10f!2sMunicipal%20Hall%20of%20Pio%20Duran%2C%20Albay!5e0!3m2!1sen!2sph!4v1718610900000"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MDRRMO Location"
              />
            </div>
            <div className="mt-4 text-gray-300">
              <p>Municipal Hall, Pio Duran, Albay</p>
              <p>Office Hours: Monday - Friday, 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-blue-800 pt-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 mb-4 md:mb-0 animate-fade-in">
              &copy; 2025 MDRRMO Pio Duran, Albay. All rights reserved.
            </div>
            <div className="flex items-center space-x-8 animate-fade-in stagger-2">
              <Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/admin" className="text-yellow-500 hover:text-yellow-300 transition-all duration-300 font-bold hover:scale-105 transform">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;