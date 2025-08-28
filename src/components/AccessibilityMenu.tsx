import React, { useState } from 'react';
import { Settings, Type, Contrast, Volume2, Eye } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  screenReader: boolean;
}

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>('accessibility-settings', {
    fontSize: 'normal',
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false
  });

  const applySettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    
    // Apply font size
    document.documentElement.classList.remove('text-lg', 'text-xl');
    if (newSettings.fontSize === 'large') {
      document.documentElement.classList.add('text-lg');
    } else if (newSettings.fontSize === 'extra-large') {
      document.documentElement.classList.add('text-xl');
    }

    // Apply contrast
    document.documentElement.classList.remove('high-contrast');
    if (newSettings.contrast === 'high') {
      document.documentElement.classList.add('high-contrast');
    }

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  };

  React.useEffect(() => {
    applySettings(settings);
  }, []);

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-3/4 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Accessibility Options"
        aria-label="Open accessibility menu"
      >
        <Settings size={20} />
      </button>

      {/* Accessibility Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Accessibility Options</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Type size={16} className="inline mr-2" />
                  Font Size
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'normal', label: 'Normal' },
                    { value: 'large', label: 'Large' },
                    { value: 'extra-large', label: 'Extra Large' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="fontSize"
                        value={option.value}
                        checked={settings.fontSize === option.value}
                        onChange={(e) => applySettings({ ...settings, fontSize: e.target.value as any })}
                        className="mr-2"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contrast */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Contrast size={16} className="inline mr-2" />
                  Contrast
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'normal', label: 'Normal Contrast' },
                    { value: 'high', label: 'High Contrast' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="contrast"
                        value={option.value}
                        checked={settings.contrast === option.value}
                        onChange={(e) => applySettings({ ...settings, contrast: e.target.value as any })}
                        className="mr-2"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reduced Motion */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => applySettings({ ...settings, reducedMotion: e.target.checked })}
                    className="mr-2"
                  />
                  <Eye size={16} className="mr-2" />
                  <span className="text-sm font-medium text-gray-700">Reduce Motion</span>
                </label>
                <p className="text-xs text-gray-500 ml-6">Minimize animations and transitions</p>
              </div>

              {/* Screen Reader */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.screenReader}
                    onChange={(e) => applySettings({ ...settings, screenReader: e.target.checked })}
                    className="mr-2"
                  />
                  <Volume2 size={16} className="mr-2" />
                  <span className="text-sm font-medium text-gray-700">Screen Reader Optimized</span>
                </label>
                <p className="text-xs text-gray-500 ml-6">Enhanced for screen readers</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  applySettings({
                    fontSize: 'normal',
                    contrast: 'normal',
                    reducedMotion: false,
                    screenReader: false
                  });
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;