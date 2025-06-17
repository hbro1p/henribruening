
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

      const linkPromises = files?.map(async (file) => {
        const { data } = await supabase.storage
          .from(bucketName)
          .getPublicUrl(file.name);
        
        return {
          name: file.name,
          url: data.publicUrl
        };
      }) || [];

      const resolvedLinks = await Promise.all(linkPromises);
      setLinks(resolvedLinks);
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
