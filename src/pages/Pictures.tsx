
import React from 'react';
import { Link } from 'react-router-dom';

const Pictures = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl mb-4">[ My Pictures ]</h1>
      <p className="mb-8">A gallery of feelings. Coming soon.</p>
      <Link to="/desktop" className="text-xl underline hover:text-windows-blue transition-colors">
        &lt;- Back to Desktop
      </Link>
    </div>
  );
};

export default Pictures;
