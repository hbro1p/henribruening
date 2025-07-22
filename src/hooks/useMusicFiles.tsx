
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLogger } from '@/utils/secureLogger';

interface MusicFile {
  name: string;
  url: string;
  title: string;
}

export const useMusicFiles = () => {
  console.log('useMusicFiles hook called');
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log('useMusicFiles useState calls completed');

  const isAudioFile = (filename: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
    const lowerFilename = filename.toLowerCase();
    return audioExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  const formatTitle = (filename: string): string => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    const fetchMusicFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        secureLogger.info('Fetching music files');

        const { data: files, error: listError } = await supabase.storage
          .from('music')
          .list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          secureLogger.error('Error listing music files', { error: listError.message });
          setError('Failed to load music files');
          return;
        }

        if (!files) {
          secureLogger.info('No files found in music bucket');
          setMusicFiles([]);
          return;
        }

        secureLogger.info(`Found ${files.length} items in music bucket`);

        const audioFiles: MusicFile[] = [];

        for (const file of files) {
          if (file.id === null) {
            secureLogger.debug(`Skipping folder: ${file.name}`);
            continue;
          }

          if (file.name && isAudioFile(file.name)) {
            const { data: urlData } = supabase.storage
              .from('music')
              .getPublicUrl(file.name);

            if (urlData?.publicUrl) {
              audioFiles.push({
                name: file.name,
                url: urlData.publicUrl,
                title: formatTitle(file.name)
              });
              secureLogger.debug(`Added audio file: ${file.name}`);
            }
          } else {
            secureLogger.debug(`Skipping non-audio file: ${file.name}`);
          }
        }

        secureLogger.info(`Successfully loaded ${audioFiles.length} audio files`);
        setMusicFiles(audioFiles);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        secureLogger.error('Error fetching music files', { error: errorMessage });
        setError('Failed to load music files. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMusicFiles();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
  };

  return { musicFiles, loading, error, refetch };
};
