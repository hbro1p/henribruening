
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Settings = () => {
  const [language, setLanguage] = useState('english');
  const [theme, setTheme] = useState('retro-gradient');

  const themes = [
    {
      id: 'retro-gradient',
      name: 'Retro Gradient',
      preview: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500'
    },
    {
      id: 'dark-vhs',
      name: 'Dark VHS',
      preview: 'bg-gradient-to-br from-black via-green-900 to-purple-900'
    },
    {
      id: 'space-mood',
      name: 'Space Mood',
      preview: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-black'
    },
    {
      id: 'light-os',
      name: 'Light OS 2001',
      preview: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Settings Window Frame */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-3 border-4 border-black/40 w-full max-w-2xl shadow-2xl rounded-lg">
        {/* Title bar with realistic depth */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-3 rounded-t border-b-4 border-black/30 shadow-inner relative">
          <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-t"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-4 h-4 bg-gradient-to-br from-red-400 via-red-500 to-red-700 rounded-full border-2 border-black/30 shadow-lg">
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-300 to-transparent rounded-full"></div>
            </div>
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-full border-2 border-black/30 shadow-lg">
              <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-300 to-transparent rounded-full"></div>
            </div>
            <div className="w-4 h-4 bg-gradient-to-br from-green-400 via-green-500 to-green-700 rounded-full border-2 border-black/30 shadow-lg">
              <div className="absolute inset-0.5 bg-gradient-to-br from-green-300 to-transparent rounded-full"></div>
            </div>
            <span className="text-white font-pixel text-lg ml-3 drop-shadow-lg">Settings</span>
          </div>
        </div>
        
        {/* Window content with textured background */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-8 border-4 border-white/30 shadow-inner rounded-b relative">
          <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-black/5 rounded"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Language Section */}
            <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 p-6 rounded-lg border-3 border-black/20 shadow-xl">
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className="text-2xl font-pixel text-black mb-6 drop-shadow-sm relative z-10">Language:</h2>
              <RadioGroup value={language} onValueChange={setLanguage} className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="english" 
                      id="english"
                      className="w-6 h-6 border-3 border-black/40 bg-gradient-to-br from-white to-gray-200 shadow-lg data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600"
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="english" className="text-xl font-pixel text-black drop-shadow-sm cursor-pointer">
                    English
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <RadioGroupItem 
                      value="deutsch" 
                      id="deutsch"
                      className="w-6 h-6 border-3 border-black/40 bg-gradient-to-br from-white to-gray-200 shadow-lg data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-600"
                    />
                    <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  </div>
                  <label htmlFor="deutsch" className="text-xl font-pixel text-black drop-shadow-sm cursor-pointer">
                    Deutsch
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Theme Section */}
            <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 p-6 rounded-lg border-3 border-black/20 shadow-xl">
              <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              <h2 className="text-2xl font-pixel text-black mb-6 drop-shadow-sm relative z-10">Theme:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 rounded-lg border-3 transition-all duration-200 hover:scale-105 transform-gpu ${
                      theme === themeOption.id 
                        ? 'border-black/60 shadow-2xl bg-gradient-to-br from-white/30 to-white/10' 
                        : 'border-black/30 shadow-lg bg-gradient-to-br from-white/20 to-transparent hover:border-black/40'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-md mb-3 border-2 border-black/30 shadow-inner ${themeOption.preview}`}>
                      <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                    </div>
                    <span className="text-lg font-pixel text-black drop-shadow-sm">
                      {themeOption.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-6 rounded-lg border-3 border-black/30 shadow-xl">
              <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-black/10 rounded-lg"></div>
              <div className="space-y-2 text-black font-pixel relative z-10">
                <div className="text-lg drop-shadow-sm">Henri OS v2.1</div>
                <div className="text-base drop-shadow-sm">Build 2024.12</div>
                <div className="text-base drop-shadow-sm">Creative Edition</div>
                <div className="text-sm drop-shadow-sm mt-4 opacity-80">© 2024 Henri Brüning</div>
              </div>
            </div>

            <Link 
              to="/desktop" 
              className="inline-block mt-8 text-2xl underline text-blue-800 hover:text-blue-900 transition-colors font-pixel drop-shadow-sm hover:scale-105 transform-gpu duration-200"
            >
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
