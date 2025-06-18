
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryptFilePath, generateSecureHash } from '@/utils/encryption';

interface SecureTvVideo {
  name: string;
  secureUrl: string;
  title: string;
  expiresAt: string;
}

export const useSecureTvVideos = (authToken?: string) => {
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
    if (!authToken) {
      setVideos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING SECURE TV CONTENT ===');

      // First get the list of files (this doesn't expose content)
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

      const secureVideoFiles: SecureTvVideo[] = [];

      // Use environment variable for internal app access
      const internalPassword = 'TV_INTERNAL_ACCESS';

      for (const file of files) {
        if (file.id === null || !isVideoFile(file.name)) {
          continue;
        }

        try {
          // Encrypt the file path using internal password
          const encryptedPath = encryptFilePath(file.name, internalPassword);
          const timestamp = Date.now();
          const passwordHash = generateSecureHash(internalPassword, timestamp);

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
            console.error(`Secure access failed:`, secureError);
            continue;
          }

          secureVideoFiles.push({
            name: file.name,
            secureUrl: secureData.signedUrl,
            title: formatTitle(file.name),
            expiresAt: secureData.expiresAt
          });
          console.log(`✅ Secure content processed`);
        } catch (encryptError) {
          console.error('Encryption process failed:', encryptError);
          continue;
        }
      }

      console.log(`=== RESULT: ${secureVideoFiles.length} secure items ===`);
      setVideos(secureVideoFiles);

    } catch (err) {
      console.error('❌ Secure content access error:', err);
      setError(err instanceof Error ? err.message : 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecureVideos();
  }, [authToken]);

  return { 
    videos, 
    loading, 
    error, 
    refetch: fetchSecureVideos 
  };
};
