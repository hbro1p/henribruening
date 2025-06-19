
-- Remove the overly permissive storage policies and create more secure ones

-- Drop existing overly permissive policies for pictures bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete pictures" ON storage.objects;

-- Drop existing overly permissive policies for music bucket
DROP POLICY IF EXISTS "Public Access Music" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Music" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Music" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Music" ON storage.objects;

-- Drop existing overly permissive policies for TV bucket
DROP POLICY IF EXISTS "Allow public access to TV videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to TV bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from TV bucket" ON storage.objects;

-- Create secure read-only policies for public content
CREATE POLICY "Public read access to pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'pictures');

CREATE POLICY "Public read access to music" ON storage.objects
FOR SELECT USING (bucket_id = 'music');

CREATE POLICY "Public read access to TV videos" ON storage.objects
FOR SELECT USING (bucket_id = 'tv');

-- Add file type restrictions for pictures bucket (without content size check)
CREATE POLICY "Restricted picture uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pictures' AND
  (storage.foldername(name))[1] IN ('childhood', 'nature', 'vibe', 'random') AND
  (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp')
);

-- Add file type restrictions for music bucket (without content size check)
CREATE POLICY "Restricted music uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'music' AND
  (storage.extension(name)) IN ('mp3', 'wav', 'ogg', 'flac', 'm4a')
);

-- Add file type restrictions for TV bucket
CREATE POLICY "Restricted TV uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tv' AND
  (storage.extension(name)) IN ('mp4', 'webm', 'quicktime', 'avi', 'mov', 'mkv')
);

-- Remove public delete/update capabilities entirely
-- Only allow updates/deletes through secure edge functions with proper authentication
