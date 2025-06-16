
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
    vibe: [],
    random: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all files from the pictures bucket
        const { data: files, error: listError } = await supabase.storage
          .from(bucketName)
          .list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error('Error listing files:', listError);
          setError(listError.message);
          return;
        }

        if (!files) {
          setError('No files found');
          return;
        }

        // Initialize categories
        const categorizedImages: Record<string, string[]> = {
          childhood: [],
          nature: [],
          vibe: [],
          random: []
        };

        // Process files and categorize them
        for (const file of files) {
          if (file.name && (file.name.toLowerCase().includes('.jpg') || 
                           file.name.toLowerCase().includes('.jpeg') || 
                           file.name.toLowerCase().includes('.png') || 
                           file.name.toLowerCase().includes('.gif') || 
                           file.name.toLowerCase().includes('.webp'))) {
            
            // Get public URL for the image
            const { data: urlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(file.name);

            if (urlData?.publicUrl) {
              const fileName = file.name.toLowerCase();
              
              // Categorize based on filename or folder structure
              if (fileName.includes('childhood') || fileName.includes('child') || fileName.includes('kid')) {
                categorizedImages.childhood.push(urlData.publicUrl);
              } else if (fileName.includes('nature') || fileName.includes('landscape') || fileName.includes('outdoor')) {
                categorizedImages.nature.push(urlData.publicUrl);
              } else if (fileName.includes('vibe') || fileName.includes('mood') || fileName.includes('aesthetic')) {
                categorizedImages.vibe.push(urlData.publicUrl);
              } else {
                categorizedImages.random.push(urlData.publicUrl);
              }
            }
          }
        }

        // Also check for folder-based organization
        const folders = ['childhood', 'nature', 'vibe', 'random'];
        
        for (const folder of folders) {
          const { data: folderFiles, error: folderError } = await supabase.storage
            .from(bucketName)
            .list(folder, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (!folderError && folderFiles) {
            for (const file of folderFiles) {
              if (file.name && (file.name.toLowerCase().includes('.jpg') || 
                               file.name.toLowerCase().includes('.jpeg') || 
                               file.name.toLowerCase().includes('.png') || 
                               file.name.toLowerCase().includes('.gif') || 
                               file.name.toLowerCase().includes('.webp'))) {
                
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

        setImages(categorizedImages);
        console.log('Categorized images:', categorizedImages);
        
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [bucketName]);

  return { images, loading, error, refetch: () => window.location.reload() };
};
