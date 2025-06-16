
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame with 3D effect */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 border-2 border-black/30 w-full max-w-3xl shadow-2xl rounded-lg">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-2 rounded-t border-b-2 border-black/20 shadow-inner">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">About.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b">
          <div className="flex flex-col items-start">
            <h1 className="text-4xl mb-6 text-black font-pixel drop-shadow-lg self-start">[ A Walk Through My Brain ]</h1>
            <div className="space-y-4 text-black text-lg text-left">
              <p className="drop-shadow-sm">
                Hi, I'm Henri – a 17-year-old creative from Germany who sees the world through a lens that's a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.
              </p>
              <p className="drop-shadow-sm">
                I'm someone who loves to explore – new places, new people, new ways of expressing myself. Whether it's through photography, video, design, or just late-night ideas written down in my notes app, I enjoy creating things that make others feel something. I believe creativity should be a playground, not a pressure – and that's the energy I try to bring into everything I do.
              </p>
              <p className="drop-shadow-sm">
                I've always been fascinated by the mix of old and new. I love analog cameras just as much as glitchy websites. I enjoy building digital spaces that feel human, that are imperfect, honest, and a little playful. This site is a piece of that – not just a portfolio, but a small reflection of who I am, where I've been, and what I'm still figuring out.
              </p>
              <p className="drop-shadow-sm">
                If you want to connect, collaborate, or just share thoughts – feel free to reach out. I'm always open to new ideas, new perspectives, and new stories.
              </p>
            </div>
            <Link to="/desktop" className="mt-8 text-xl underline text-purple-800 hover:text-purple-900 transition-colors font-pixel drop-shadow-sm self-start">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
