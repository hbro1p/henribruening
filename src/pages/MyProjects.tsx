
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, ExternalLink } from 'lucide-react';

const MyProjects = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const correctPassword = 'henribrueningprojects#2025!';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsUnlocked(true);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
        <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-md shadow-2xl">
          <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <Code className="w-16 h-16 text-black mb-4" />
              <h1 className="text-2xl mb-4 text-black">[ My Projects ]</h1>
              <p className="mb-6 text-black">Oops... looks like this section requires a password 😅</p>
              <p className="mb-6 text-black">Enter the password to continue.</p>
              
              <form onSubmit={handlePasswordSubmit} className="w-full">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-4 border-2 border-black bg-white text-black"
                  placeholder="Password"
                />
                {showError && (
                  <p className="text-red-600 mb-4 text-sm">Incorrect password. Try again.</p>
                )}
                <button
                  type="submit"
                  className="w-full p-2 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white text-black font-bold"
                >
                  Unlock
                </button>
              </form>

              <Link to="/desktop" className="mt-6 text-xl underline text-windows-blue hover:text-blue-700 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Desktop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-4xl shadow-2xl">
        <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-8 text-black">[ My Projects ]</h1>
            
            <div className="grid gap-8 text-left w-full max-w-2xl">
              <div className="bg-white p-6 border-2 border-black">
                <h3 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                  🛠 Internly
                </h3>
                <p className="text-black mb-4">Currently developing a platform to connect students with internships</p>
                <div className="space-y-2">
                  <a href="https://internly.replit.app" target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-windows-blue hover:text-blue-700 underline">
                    🌐 Website <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/internly.de/" target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-windows-blue hover:text-blue-700 underline">
                    📷 Instagram <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 border-2 border-black">
                <h3 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                  📣 Echo Coesfeld
                </h3>
                <p className="text-black mb-4">A public voice project using QR codes & interviews to gather real opinions from people in Coesfeld</p>
                <div className="space-y-2">
                  <a href="https://www.instagram.com/echo.coesfeld/" target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-windows-blue hover:text-blue-700 underline">
                    📷 Instagram <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://www.tiktok.com/@echo.coesfeld" target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-windows-blue hover:text-blue-700 underline">
                    📷 TikTok <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <Link to="/desktop" className="mt-8 text-xl underline text-windows-blue hover:text-blue-700 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
