
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryptFilePath, generateSecureHash } from '@/utils/encryption';
import { secureLogger } from '@/utils/secureLogger';

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

      secureLogger.info('Fetching encrypted TV videos');

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

      const secureVideoFiles: SecureTvVideo[] = [];

      for (const file of files) {
        if (file.id === null || !isVideoFile(file.name)) {
          continue;
        }

        try {
          const encryptedPath = encryptFilePath(file.name, password);
          const timestamp = Date.now();
          const passwordHash = generateSecureHash(password, timestamp);

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
            secureLogger.error('Failed to get secure URL for encrypted file', { error: secureError?.message });
            continue;
          }

          secureVideoFiles.push({
            name: file.name,
            secureUrl: secureData.signedUrl,
            title: formatTitle(file.name),
            expiresAt: secureData.expiresAt
          });
          secureLogger.debug('Added encrypted video file');
        } catch (encryptError) {
          secureLogger.error('Failed to encrypt file path', { error: encryptError instanceof Error ? encryptError.message : 'Unknown error' });
          continue;
        }
      }

      secureLogger.info(`Successfully loaded ${secureVideoFiles.length} encrypted video files`);
      setVideos(secureVideoFiles);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      secureLogger.error('Error fetching encrypted TV videos', { error: errorMessage });
      setError('Failed to load encrypted videos. Please try again.');
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
