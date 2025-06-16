
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

        // Initialize categories
        const categorizedImages: Record<string, string[]> = {
          childhood: [],
          nature: [],
          vibe: [],
          random: []
        };

        // Check for folder-based organization first
        const folders = ['childhood', 'nature', 'vibe', 'random'];
        
        for (const folder of folders) {
          console.log(`Checking folder: ${folder}`);
          const { data: folderFiles, error: folderError } = await supabase.storage
            .from(bucketName)
            .list(folder, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (!folderError && folderFiles) {
            console.log(`Found ${folderFiles.length} files in ${folder} folder`);
            for (const file of folderFiles) {
              // Skip if it's a folder (id is null for folders)
              if (!file.id) continue;
              
              if (file.name && this.isImageFile(file.name)) {
                const { data: urlData } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(`${folder}/${file.name}`);

                if (urlData?.publicUrl) {
                  categorizedImages[folder as keyof typeof categorizedImages].push(urlData.publicUrl);
                  console.log(`Added image to ${folder}: ${file.name}`);
                }
              }
            }
          } else if (folderError) {
            console.log(`No folder found for ${folder} or error:`, folderError);
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
          console.log(`Found ${rootFiles.length} files in root`);
          for (const file of rootFiles) {
            // Skip folders
            if (file.id === null) continue;
            
            if (file.name && this.isImageFile(file.name)) {
              const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(file.name);

              if (urlData?.publicUrl) {
                const fileName = file.name.toLowerCase();
                
                // Categorize based on filename
                if (this.matchesCategory(fileName, 'childhood')) {
                  categorizedImages.childhood.push(urlData.publicUrl);
                } else if (this.matchesCategory(fileName, 'nature')) {
                  categorizedImages.nature.push(urlData.publicUrl);
                } else if (this.matchesCategory(fileName, 'vibe')) {
                  categorizedImages.vibe.push(urlData.publicUrl);
                } else {
                  categorizedImages.random.push(urlData.publicUrl);
                }
                console.log(`Categorized root image: ${file.name}`);
              }
            }
          }
        }

        // Log final counts
        Object.keys(categorizedImages).forEach(category => {
          console.log(`${category}: ${categorizedImages[category].length} images`);
        });

        setImages(categorizedImages);
        console.log('Final categorized images:', categorizedImages);
        
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [bucketName]);

  // Helper method to check if a file is an image
  const isImageFile = (filename: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const lowerFilename = filename.toLowerCase();
    return imageExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  // Helper method to match filename to category
  const matchesCategory = (filename: string, category: string): boolean => {
    const categoryKeywords = {
      childhood: ['childhood', 'child', 'kid', 'baby', 'young'],
      nature: ['nature', 'landscape', 'outdoor', 'tree', 'forest', 'mountain', 'beach', 'sky'],
      vibe: ['vibe', 'mood', 'aesthetic', 'art', 'style', 'cool']
    };

    const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
    return keywords.some(keyword => filename.includes(keyword));
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-trigger the useEffect
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize categories
        const categorizedImages: Record<string, string[]> = {
          childhood: [],
          nature: [],
          vibe: [],
          random: []
        };

        // Check for folder-based organization first
        const folders = ['childhood', 'nature', 'vibe', 'random'];
        
        for (const folder of folders) {
          console.log(`Checking folder: ${folder}`);
          const { data: folderFiles, error: folderError } = await supabase.storage
            .from('pictures')
            .list(folder, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' }
            });

          if (!folderError && folderFiles) {
            console.log(`Found ${folderFiles.length} files in ${folder} folder`);
            for (const file of folderFiles) {
              // Skip if it's a folder (id is null for folders)
              if (!file.id) continue;
              
              if (file.name && isImageFile(file.name)) {
                const { data: urlData } = supabase.storage
                  .from('pictures')
                  .getPublicUrl(`${folder}/${file.name}`);

                if (urlData?.publicUrl) {
                  categorizedImages[folder as keyof typeof categorizedImages].push(urlData.publicUrl);
                  console.log(`Added image to ${folder}: ${file.name}`);
                }
              }
            }
          } else if (folderError) {
            console.log(`No folder found for ${folder} or error:`, folderError);
          }
        }

        // Also check root level files and categorize them
        const { data: rootFiles, error: rootError } = await supabase.storage
          .from('pictures')
          .list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (!rootError && rootFiles) {
          console.log(`Found ${rootFiles.length} files in root`);
          for (const file of rootFiles) {
            // Skip folders
            if (file.id === null) continue;
            
            if (file.name && isImageFile(file.name)) {
              const { data: urlData } = supabase.storage
                .from('pictures')
                .getPublicUrl(file.name);

              if (urlData?.publicUrl) {
                const fileName = file.name.toLowerCase();
                
                // Categorize based on filename
                if (matchesCategory(fileName, 'childhood')) {
                  categorizedImages.childhood.push(urlData.publicUrl);
                } else if (matchesCategory(fileName, 'nature')) {
                  categorizedImages.nature.push(urlData.publicUrl);
                } else if (matchesCategory(fileName, 'vibe')) {
                  categorizedImages.vibe.push(urlData.publicUrl);
                } else {
                  categorizedImages.random.push(urlData.publicUrl);
                }
                console.log(`Categorized root image: ${file.name}`);
              }
            }
          }
        }

        // Log final counts
        Object.keys(categorizedImages).forEach(category => {
          console.log(`${category}: ${categorizedImages[category].length} images`);
        });

        setImages(categorizedImages);
        console.log('Final categorized images:', categorizedImages);
        
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  };

  return { images, loading, error, refetch };
};
