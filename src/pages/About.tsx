
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame */}
      <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-3xl shadow-2xl">
        <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-4 sm:p-8">
          <div className="flex flex-col items-start">
            <h1 className="text-4xl mb-6 text-black self-start">[ A Walk Through My Brain ]</h1>
            <div className="space-y-4 text-black text-lg text-left">
              <p>
                Hi, I’m Henri – a 17-year-old creative from Germany who sees the world through a lens that’s a little nostalgic, a little curious, and always searching for meaning. I started taking photos not because I wanted to be a photographer, but because I wanted to hold on to feelings. To moments. To the little things that usually slip by unnoticed.
              </p>
              <p>
                I’m someone who loves to explore – new places, new people, new ways of expressing myself. Whether it’s through photography, video, design, or just late-night ideas written down in my notes app, I enjoy creating things that make others feel something. I believe creativity should be a playground, not a pressure – and that’s the energy I try to bring into everything I do.
              </p>
              <p>
                I’ve always been fascinated by the mix of old and new. I love analog cameras just as much as glitchy websites. I enjoy building digital spaces that feel human, that are imperfect, honest, and a little playful. This site is a piece of that – not just a portfolio, but a small reflection of who I am, where I’ve been, and what I’m still figuring out.
              </p>
              <p>
                If you want to connect, collaborate, or just share thoughts – feel free to reach out. I’m always open to new ideas, new perspectives, and new stories.
              </p>
            </div>
            <Link to="/desktop" className="mt-8 text-xl underline text-windows-blue hover:text-blue-700 transition-colors self-start">
              &lt;- Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
