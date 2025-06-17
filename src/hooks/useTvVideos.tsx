
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

      console.log('=== FETCHING TV VIDEOS ===');

      const { data: files, error: listError } = await supabase.storage
        .from('tv')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Error listing TV videos:', listError);
        setError('Failed to load TV videos');
        return;
      }

      if (!files) {
        console.log('No files found in TV bucket');
        setVideos([]);
        return;
      }

      console.log(`Found ${files.length} items in TV bucket`);

      const videoFiles: TvVideo[] = [];

      for (const file of files) {
        if (file.id === null) {
          console.log(`Skipping folder: ${file.name}`);
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
            console.log(`✅ Added video file: ${file.name}`);
          }
        } else {
          console.log(`❌ Skipping non-video file: ${file.name}`);
        }
      }

      console.log(`=== FINAL RESULT: ${videoFiles.length} video files ===`);
      setVideos(videoFiles);

    } catch (err) {
      console.error('❌ Error fetching TV videos:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Return both the state and a refresh function
  return { 
    videos, 
    loading, 
    error, 
    refetch: fetchVideos 
  };
};
