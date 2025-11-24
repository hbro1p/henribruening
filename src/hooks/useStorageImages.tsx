
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
}

export const useStorageImages = (bucketName: string = 'pictures') => {
  const [images, setImages] = useState<Record<string, string[]>>({
    childhood: [],
    nature: [],
    travel: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper method to check if a file is an image that browsers can display
  const isDisplayableImage = (filename: string): boolean => {
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const lowerFilename = filename.toLowerCase();
    return supportedExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  // Helper method to check if file is HEIC (unsupported by browsers)
  const isHeicFile = (filename: string): boolean => {
    const lowerFilename = filename.toLowerCase();
    return lowerFilename.endsWith('.heic') || lowerFilename.endsWith('.heif');
  };

  // Helper method to match filename to category
  const matchesCategory = (filename: string, category: string): boolean => {
    const categoryKeywords = {
      childhood: ['childhood', 'child', 'kid', 'baby', 'young'],
      nature: ['nature', 'landscape', 'outdoor', 'tree', 'forest', 'mountain', 'beach', 'sky'],
      travel: ['travel', 'trip', 'vacation', 'journey', 'adventure', 'explore']
    };

    const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
    return keywords.some(keyword => filename.includes(keyword));
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize categories
        const categorizedImages: Record<string, string[]> = {
          childhood: [],
          nature: [],
          travel: []
        };

        // Check for folder-based organization first
        const folders = ['childhood', 'nature', 'travel'];
        
        for (const folder of folders) {
          const { data: folderFiles, error: folderError } = await supabase.storage
            .from(bucketName)
            .list(folder, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (!folderError && folderFiles) {
            for (const file of folderFiles) {
              // Skip if it's a folder (id is null for folders)
              if (!file.id) continue;
              
              if (file.name) {
                if (isHeicFile(file.name)) continue;
                
                if (isDisplayableImage(file.name)) {
                  const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(`${folder}/${file.name}`);

                  if (urlData?.publicUrl) {
                    categorizedImages[folder as keyof typeof categorizedImages].push(urlData.publicUrl);
                  }
                }
              }
            }
          }
        }

        // Also check root level files and categorize them
        const { data: rootFiles, error: rootError } = await supabase.storage
          .from(bucketName)
          .list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (!rootError && rootFiles) {
          for (const file of rootFiles) {
            // Skip folders (they have id === null)
            if (file.id === null) continue;
            
            if (file.name) {
              if (isHeicFile(file.name)) continue;
              
              if (isDisplayableImage(file.name)) {
                const { data: urlData } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(file.name);

                if (urlData?.publicUrl) {
                  const fileName = file.name.toLowerCase();
                  
                  // Categorize based on filename
                  if (matchesCategory(fileName, 'childhood')) {
                    categorizedImages.childhood.push(urlData.publicUrl);
                  } else if (matchesCategory(fileName, 'nature')) {
                    categorizedImages.nature.push(urlData.publicUrl);
                  } else if (matchesCategory(fileName, 'travel')) {
                    categorizedImages.travel.push(urlData.publicUrl);
                  }
                }
              }
            }
          }
        }


        setImages(categorizedImages);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [bucketName]);

  const refetch = () => {
    // Just re-trigger the useEffect
    setLoading(true);
    setError(null);
    // The useEffect will handle the rest
  };

  return { images, loading, error, refetch };
};
