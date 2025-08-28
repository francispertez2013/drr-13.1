import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Share2, 
  Copy, 
  Check,
  MessageCircle,
  Mail,
  Link
} from 'lucide-react';

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'buttons' | 'dropdown' | 'floating';
  showLabels?: boolean;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url = window.location.href,
  title = 'MDRRMO Pio Duran',
  description = 'Municipal Disaster Risk Reduction and Management Office',
  image,
  hashtags = ['MDRRMO', 'PioDuran', 'DisasterPreparedness'],
  size = 'md',
  variant = 'buttons',
  showLabels = true
}) => {
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    hashtags: hashtags.join(',')
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-sky-500',
      url: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}&hashtags=${shareData.hashtags}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-500',
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-gray-600',
      url: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`
    }
  ];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const handleShare = (platform: any) => {
    if (platform.name === 'Email') {
      window.location.href = platform.url;
    } else {
      window.open(platform.url, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  if (variant === 'floating') {
    return (
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
        {socialPlatforms.slice(0, 4).map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`${platform.color} text-white ${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
            title={`Share on ${platform.name}`}
          >
            <platform.icon size={iconSizes[size]} />
          </button>
        ))}
        <button
          onClick={copyToClipboard}
          className={`bg-gray-600 hover:bg-gray-700 text-white ${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
          title="Copy Link"
        >
          {copied ? <Check size={iconSizes[size]} /> : <Copy size={iconSizes[size]} />}
        </button>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-48">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => {
                  handleShare(platform);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
              >
                <platform.icon size={16} className={platform.textColor} />
                <span className="text-gray-700">{platform.name}</span>
              </button>
            ))}
            <hr className="my-2" />
            <button
              onClick={() => {
                copyToClipboard();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-600" />}
              <span className="text-gray-700">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            {navigator.share && (
              <button
                onClick={() => {
                  handleNativeShare();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
              >
                <Share2 size={16} className="text-gray-600" />
                <span className="text-gray-700">More Options</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default buttons variant
  return (
    <div className="flex items-center space-x-3">
      {showLabels && (
        <span className="text-sm font-medium text-gray-700">Share:</span>
      )}
      
      <div className="flex items-center space-x-2">
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`${platform.color} text-white ${sizeClasses[size]} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105`}
            title={`Share on ${platform.name}`}
          >
            <platform.icon size={iconSizes[size]} />
          </button>
        ))}
        
        <button
          onClick={copyToClipboard}
          className={`bg-gray-600 hover:bg-gray-700 text-white ${sizeClasses[size]} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105`}
          title="Copy Link"
        >
          {copied ? <Check size={iconSizes[size]} /> : <Copy size={iconSizes[size]} />}
        </button>
      </div>
    </div>
  );
};

export default SocialShareButtons;