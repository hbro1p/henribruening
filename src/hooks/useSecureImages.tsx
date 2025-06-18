
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureImage {
  name: string;
  url: string;
  folder: string;
}

interface SecureImageCategories {
  childhood: SecureImage[];
  nature: SecureImage[];
  vibe: SecureImage[];
  random: SecureImage[];
}

export const useSecureImages = (isAuthenticated: boolean = true) => {
  const [images, setImages] = useState<SecureImageCategories>({
    childhood: [],
    nature: [],
    vibe: [],
    random: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isImageFile = (filename: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const lowerFilename = filename.toLowerCase();
    return imageExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  const fetchImages = async () => {
    if (!isAuthenticated) {
      setImages({ childhood: [], nature: [], vibe: [], random: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING IMAGES ===');

      const folders = ['childhood', 'nature', 'vibe', 'random'];
      const imageCategories: SecureImageCategories = {
        childhood: [],
        nature: [],
        vibe: [],
        random: []
      };

      for (const folder of folders) {
        const { data: files, error: listError } = await supabase.storage
          .from('pictures')
          .list(folder, {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error(`Error listing ${folder} images:`, listError);
          continue;
        }

        if (!files) continue;

        for (const file of files) {
          if (file.id === null || !isImageFile(file.name)) {
            continue;
          }

          const filePath = `${folder}/${file.name}`;
          
          // Get public URL for the file
          const { data: urlData } = supabase.storage
            .from('pictures')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            imageCategories[folder as keyof SecureImageCategories].push({
              name: file.name,
              url: urlData.publicUrl,
              folder
            });
          }
        }

        console.log(`✅ Added ${imageCategories[folder as keyof SecureImageCategories].length} images from ${folder}`);
      }

      setImages(imageCategories);

    } catch (err) {
      console.error('❌ Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [isAuthenticated]);

  return { 
    images, 
    loading, 
    error, 
    refetch: fetchImages 
  };
};
