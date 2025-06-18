
import React, { useState, useEffect } from 'react';
import { useSecureImages } from '@/hooks/useSecureImages';
import { Loader2 } from 'lucide-react';

const MyProjects = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Check if user is authenticated at app level
  const isAuthenticated = sessionStorage.getItem('app_authenticated') === 'true';
  
  // Use internal access token since app-level auth is handled at entry
  const { images, loading, error } = useSecureImages(isAuthenticated ? 'PROJECTS_INTERNAL_ACCESS' : undefined);

  const allImages = [
    ...images.childhood,
    ...images.nature, 
    ...images.vibe,
    ...images.random
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (allImages.length > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [allImages.length]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-300">Access Denied</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Projects unavailable</p>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-300">No projects available</p>
        </div>
      </div>
    );
  }

  const currentImage = allImages[currentImageIndex];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          key={currentImage.secureUrl}
          src={currentImage.secureUrl}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain transition-opacity duration-1000"
          onError={(e) => {
            console.error('Image load error for secure project content');
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        {currentImageIndex + 1} / {allImages.length}
      </div>
    </div>
  );
};

export default MyProjects;
