
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StorageLink {
  name: string;
  url: string;
}

export const useStorageLinks = (bucketName: string) => {
  const [links, setLinks] = useState<StorageLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 100,
          offset: 0
        });

      if (listError) {
        throw listError;
      }

      // Process files to extract URLs from text files
      const linkPromises = files?.map(async (file) => {
        if (file.name.endsWith('.txt') || file.name.endsWith('.url')) {
          // Download the file content to get the actual URL
          const { data: fileData, error: downloadError } = await supabase.storage
            .from(bucketName)
            .download(file.name);

          if (!downloadError && fileData) {
            const text = await fileData.text();
            const url = text.trim();
            
            return {
              name: file.name.replace(/\.(txt|url)$/, ''),
              url: url
            };
          }
        }
        
        // Fallback: treat as direct file and get public URL
        const { data } = await supabase.storage
          .from(bucketName)
          .getPublicUrl(file.name);
        
        return {
          name: file.name,
          url: data.publicUrl
        };
      }) || [];

      const resolvedLinks = await Promise.all(linkPromises);
      setLinks(resolvedLinks.filter(link => link.url && link.url.trim() !== ''));
    } catch (err) {
      console.error(`Error fetching links from ${bucketName}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [bucketName]);

  return { links, loading, error, refetch: fetchLinks };
};
