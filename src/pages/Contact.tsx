
import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl mb-4">[ Pass a Note ]</h1>
      <p className="mb-8">The chat window is booting up. Soon.</p>
      <Link to="/desktop" className="text-xl underline hover:text-windows-blue transition-colors">
        &lt;- Back to Desktop
      </Link>
    </div>
  );
};

export default Contact;
