
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MusicFile {
  name: string;
  url: string;
  title: string;
}

export const useMusicFiles = () => {
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAudioFile = (filename: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
    const lowerFilename = filename.toLowerCase();
    return audioExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  const formatTitle = (filename: string): string => {
    // Remove file extension and format as title
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    const fetchMusicFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('=== FETCHING MUSIC FILES ===');

        const { data: files, error: listError } = await supabase.storage
          .from('music')
          .list('', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error('Error listing music files:', listError);
          setError('Failed to load music files');
          return;
        }

        if (!files) {
          console.log('No files found in music bucket');
          setMusicFiles([]);
          return;
        }

        console.log(`Found ${files.length} items in music bucket`);

        const audioFiles: MusicFile[] = [];

        for (const file of files) {
          // Skip folders (they have id === null)
          if (file.id === null) {
            console.log(`Skipping folder: ${file.name}`);
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
              console.log(`✅ Added audio file: ${file.name}`);
            }
          } else {
            console.log(`❌ Skipping non-audio file: ${file.name}`);
          }
        }

        console.log(`=== FINAL RESULT: ${audioFiles.length} audio files ===`);
        setMusicFiles(audioFiles);

      } catch (err) {
        console.error('❌ Error fetching music files:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMusicFiles();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // The useEffect will handle the rest
  };

  return { musicFiles, loading, error, refetch };
};
