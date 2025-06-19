
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLogger } from '@/utils/secureLogger';

interface TvVideo {
  name: string;
  url: string;
  title: string;
}

export const useTvVideos = () => {
  const [videos, setVideos] = useState<TvVideo[]>([]);
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
    try {
      setLoading(true);
      setError(null);

      secureLogger.info('Fetching TV videos');

      const { data: files, error: listError } = await supabase.storage
        .from('tv')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        secureLogger.error('Error listing TV videos', { error: listError.message });
        setError('Failed to load TV videos');
        return;
      }

      if (!files) {
        secureLogger.info('No files found in TV bucket');
        setVideos([]);
        return;
      }

      secureLogger.info(`Found ${files.length} items in TV bucket`);

      const videoFiles: TvVideo[] = [];

      for (const file of files) {
        if (file.id === null) {
          secureLogger.debug(`Skipping folder: ${file.name}`);
          continue;
        }

        if (file.name && isVideoFile(file.name)) {
          const { data: urlData } = supabase.storage
            .from('tv')
            .getPublicUrl(file.name);

          if (urlData?.publicUrl) {
            videoFiles.push({
              name: file.name,
              url: urlData.publicUrl,
              title: formatTitle(file.name)
            });
            secureLogger.debug(`Added video file: ${file.name}`);
          }
        } else {
          secureLogger.debug(`Skipping non-video file: ${file.name}`);
        }
      }

      secureLogger.info(`Successfully loaded ${videoFiles.length} video files`);
      setVideos(videoFiles);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      secureLogger.error('Error fetching TV videos', { error: errorMessage });
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { 
    videos, 
    loading, 
    error, 
    refetch: fetchVideos 
  };
};
