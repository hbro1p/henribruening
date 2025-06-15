
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame */}
      <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-lg shadow-2xl">
        <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl mb-4 text-black">[ Get In Touch ]</h1>
            <p className="mb-8 text-black text-lg">Let's connect. Find me on Instagram.</p>

            <a
              href="https://www.instagram.com/henribruening/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-1 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black text-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white"
            >
              <div className="flex items-center px-4 py-2">
                <MessageSquare className="mr-3 h-6 w-6" />
                <span className="text-xl">@henribruening</span>
              </div>
            </a>

            <Link to="/desktop" className="mt-8 text-xl underline text-windows-blue hover:text-blue-700 transition-colors">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
