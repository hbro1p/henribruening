
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentFile {
  name: string;
  url: string;
  title: string;
}

export const useDirectContent = (bucket: string, enabled: boolean = true) => {
  const [files, setFiles] = useState<ContentFile[]>([]);
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

  const fetchContent = async () => {
    if (!enabled) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the list of files from the bucket
      const { data: fileList, error: listError } = await supabase.storage
        .from(bucket)
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error(`Error listing ${bucket} files:`, listError);
        setError('Failed to load content');
        return;
      }

      if (!fileList) {
        setFiles([]);
        return;
      }

      const contentFiles: ContentFile[] = [];

      for (const file of fileList) {
        if (file.id === null || !isVideoFile(file.name)) {
          continue;
        }

        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(file.name);

        if (urlData?.publicUrl) {
          contentFiles.push({
            name: file.name,
            url: urlData.publicUrl,
            title: formatTitle(file.name)
          });
        }
      }

      setFiles(contentFiles);
    } catch (err) {
      console.error(`Error fetching ${bucket} content:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [bucket, enabled]);

  return { 
    files, 
    loading, 
    error, 
    refetch: fetchContent 
  };
};
