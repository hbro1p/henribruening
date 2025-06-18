
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryptFilePath, generateSecureHash } from '@/utils/encryption';

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

      console.log('=== FETCHING ENCRYPTED TV VIDEOS ===');

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

        try {
          // Encrypt the file path
          const encryptedPath = encryptFilePath(file.name, password);
          const timestamp = Date.now();
          const passwordHash = generateSecureHash(password, timestamp);

          // Get secure signed URL using encrypted data
          const { data: secureData, error: secureError } = await supabase.functions.invoke('secure-file-access', {
            body: { 
              encryptedPath,
              passwordHash,
              timestamp,
              bucket: 'tv',
              section: 'tv'
            }
          });

          if (secureError || !secureData?.signedUrl) {
            console.error(`Failed to get secure URL for encrypted file:`, secureError);
            continue;
          }

          secureVideoFiles.push({
            name: file.name,
            secureUrl: secureData.signedUrl,
            title: formatTitle(file.name),
            expiresAt: secureData.expiresAt
          });
          console.log(`✅ Added encrypted video file`);
        } catch (encryptError) {
          console.error('Failed to encrypt file path:', encryptError);
          continue;
        }
      }

      console.log(`=== FINAL RESULT: ${secureVideoFiles.length} encrypted video files ===`);
      setVideos(secureVideoFiles);

    } catch (err) {
      console.error('❌ Error fetching encrypted TV videos:', err);
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
