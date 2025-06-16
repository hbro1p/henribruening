
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame with 3D effect */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 border-2 border-black/30 w-full max-w-lg shadow-2xl rounded-lg">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-2 rounded-t border-b-2 border-black/20 shadow-inner">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Contact.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-4 text-black font-pixel drop-shadow-lg">[ Get In Touch ]</h1>
            <p className="mb-8 text-black text-lg drop-shadow-sm">Let's connect. Find me on Instagram.</p>

            <a
              href="https://www.instagram.com/henribruening/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 text-black hover:from-gray-200 hover:via-gray-300 hover:to-gray-500 transition-all duration-200 rounded-lg shadow-lg active:scale-95"
            >
              <div className="flex items-center px-6 py-3 relative">
                {/* Button highlights */}
                <div className="absolute inset-x-1 top-1 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t"></div>
                <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-t from-black/20 to-transparent rounded-b"></div>
                
                <MessageSquare className="mr-3 h-6 w-6 drop-shadow-sm" />
                <span className="text-xl font-pixel drop-shadow-sm">@henribruening</span>
              </div>
            </a>

            <Link to="/desktop" className="mt-8 text-xl underline text-blue-800 hover:text-blue-900 transition-colors font-pixel drop-shadow-sm">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
