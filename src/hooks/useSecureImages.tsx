
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryptFilePath, generateSecureHash } from '@/utils/encryption';
import { secureLogger } from '@/utils/secureLogger';

interface SecureImage {
  name: string;
  secureUrl: string;
  folder: string;
  expiresAt: string;
}

interface SecureImageCategories {
  childhood: SecureImage[];
  nature: SecureImage[];
  vibe: SecureImage[];
  random: SecureImage[];
}

export const useSecureImages = (password?: string) => {
  const [images, setImages] = useState<SecureImageCategories>({
    childhood: [],
    nature: [],
    vibe: [],
    random: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isImageFile = (filename: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const lowerFilename = filename.toLowerCase();
    return imageExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  const fetchSecureImages = async () => {
    if (!password) {
      setImages({ childhood: [], nature: [], vibe: [], random: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      secureLogger.info('Fetching encrypted images');

      const folders = ['childhood', 'nature', 'vibe', 'random'];
      const secureCategories: SecureImageCategories = {
        childhood: [],
        nature: [],
        vibe: [],
        random: []
      };

      for (const folder of folders) {
        const { data: files, error: listError } = await supabase.storage
          .from('pictures')
          .list(folder, {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          secureLogger.error(`Error listing ${folder} images`, { error: listError.message });
          continue;
        }

        if (!files) continue;

        for (const file of files) {
          if (file.id === null || !isImageFile(file.name)) {
            continue;
          }

          const filePath = `${folder}/${file.name}`;
          
          try {
            const encryptedPath = encryptFilePath(filePath, password);
            const timestamp = Date.now();
            const passwordHash = generateSecureHash(password, timestamp);

            const { data: secureData, error: secureError } = await supabase.functions.invoke('secure-file-access', {
              body: { 
                encryptedPath,
                passwordHash,
                timestamp,
                bucket: 'pictures',
                section: 'pictures'
              }
            });

            if (secureError || !secureData?.signedUrl) {
              secureLogger.error('Failed to get secure URL for encrypted image', { error: secureError?.message });
              continue;
            }

            secureCategories[folder as keyof SecureImageCategories].push({
              name: file.name,
              secureUrl: secureData.signedUrl,
              folder,
              expiresAt: secureData.expiresAt
            });
          } catch (encryptError) {
            secureLogger.error('Failed to encrypt file path', { error: encryptError instanceof Error ? encryptError.message : 'Unknown error' });
            continue;
          }
        }

        secureLogger.info(`Added ${secureCategories[folder as keyof SecureImageCategories].length} encrypted images from ${folder}`);
      }

      setImages(secureCategories);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      secureLogger.error('Error fetching encrypted images', { error: errorMessage });
      setError('Failed to load encrypted images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecureImages();
  }, [password]);

  return { 
    images, 
    loading, 
    error, 
    refetch: fetchSecureImages 
  };
};
