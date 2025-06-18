
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureTvVideo {
  name: string;
  secureUrl: string;
  title: string;
  expiresAt: string;
}

export const useSecureTvVideos = (password?: string) => {
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

  const fetchSecureVideos = async () => {
    if (!password) {
      setVideos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING SECURE TV VIDEOS ===');

      // First get the list of files (this doesn't expose content)
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

      const secureVideoFiles: SecureTvVideo[] = [];

      for (const file of files) {
        if (file.id === null || !isVideoFile(file.name)) {
          continue;
        }

        // Get secure signed URL for each video
        const { data: secureData, error: secureError } = await supabase.functions.invoke('secure-file-access', {
          body: { 
            password, 
            bucket: 'tv', 
            filePath: file.name, 
            section: 'tv' 
          }
        });

        if (secureError || !secureData?.signedUrl) {
          console.error(`Failed to get secure URL for ${file.name}:`, secureError);
          continue;
        }

        secureVideoFiles.push({
          name: file.name,
          secureUrl: secureData.signedUrl,
          title: formatTitle(file.name),
          expiresAt: secureData.expiresAt
        });
        console.log(`✅ Added secure video file: ${file.name}`);
      }

      console.log(`=== FINAL RESULT: ${secureVideoFiles.length} secure video files ===`);
      setVideos(secureVideoFiles);

    } catch (err) {
      console.error('❌ Error fetching secure TV videos:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecureVideos();
  }, [password]);

  return { 
    videos, 
    loading, 
    error, 
    refetch: fetchSecureVideos 
  };
};
