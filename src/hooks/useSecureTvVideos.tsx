
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureTvVideo {
  name: string;
  url: string;
  title: string;
}

export const useSecureTvVideos = (isAuthenticated: boolean = true) => {
  const [videos, setVideos] = useState<SecureTvVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isVideoFile = (filename: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const lowerFilename = filename.toLowerCase();
    return videoExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  const formatTitle = (filename: string): string => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const fetchVideos = async () => {
    if (!isAuthenticated) {
      setVideos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING TV CONTENT ===');

      // Get the list of files from the bucket
      const { data: files, error: listError } = await supabase.storage
        .from('tv')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Content access error:', listError);
        setError('Content access denied');
        return;
      }

      if (!files) {
        console.log('No content found');
        setVideos([]);
        return;
      }

      console.log(`Processing ${files.length} items`);

      const videoFiles: SecureTvVideo[] = [];

      for (const file of files) {
        if (file.id === null || !isVideoFile(file.name)) {
          continue;
        }

        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from('tv')
          .getPublicUrl(file.name);

        if (urlData?.publicUrl) {
          videoFiles.push({
            name: file.name,
            url: urlData.publicUrl,
            title: formatTitle(file.name)
          });
          console.log(`✅ Content processed`);
        }
      }

      console.log(`=== RESULT: ${videoFiles.length} items ===`);
      setVideos(videoFiles);

    } catch (err) {
      console.error('❌ Content access error:', err);
      setError(err instanceof Error ? err.message : 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [isAuthenticated]);

  return { 
    videos, 
    loading, 
    error, 
    refetch: fetchVideos 
  };
};
