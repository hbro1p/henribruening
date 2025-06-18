
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryptFilePath, generateSecureHash } from '@/utils/encryption';

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

      console.log('=== FETCHING ENCRYPTED IMAGES ===');

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
          console.error(`Error listing ${folder} images:`, listError);
          continue;
        }

        if (!files) continue;

        for (const file of files) {
          if (file.id === null || !isImageFile(file.name)) {
            continue;
          }

          const filePath = `${folder}/${file.name}`;
          
          try {
            // Encrypt the file path
            const encryptedPath = encryptFilePath(filePath, password);
            const timestamp = Date.now();
            const passwordHash = generateSecureHash(password, timestamp);

            // Get secure signed URL using encrypted data
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
              console.error(`Failed to get secure URL for encrypted image:`, secureError);
              continue;
            }

            secureCategories[folder as keyof SecureImageCategories].push({
              name: file.name,
              secureUrl: secureData.signedUrl,
              folder,
              expiresAt: secureData.expiresAt
            });
          } catch (encryptError) {
            console.error('Failed to encrypt file path:', encryptError);
            continue;
          }
        }

        console.log(`✅ Added ${secureCategories[folder as keyof SecureImageCategories].length} encrypted images from ${folder}`);
      }

      setImages(secureCategories);

    } catch (err) {
      console.error('❌ Error fetching encrypted images:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
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
