
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

      // Process files to extract URLs from .docx or .txt files
      const linkPromises = files?.map(async (file) => {
        if (file.name.endsWith('.docx') || file.name.endsWith('.txt')) {
          try {
            // Download the file content to get the actual URL
            const { data: fileData, error: downloadError } = await supabase.storage
              .from(bucketName)
              .download(file.name);

            if (!downloadError && fileData) {
              const text = await fileData.text();
              const url = text.trim();
              
              return {
                name: file.name.replace(/\.(docx|txt)$/, ''),
                url: url
              };
            }
          } catch (e) {
            console.error(`Error processing file ${file.name}:`, e);
          }
        }
        
        return null;
      }) || [];

      const resolvedLinks = await Promise.all(linkPromises);
      setLinks(resolvedLinks.filter((link): link is StorageLink => 
        link !== null && link.url && link.url.trim() !== ''
      ));
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
