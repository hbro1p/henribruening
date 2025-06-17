
-- Create a storage bucket for TV videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tv',
  'tv',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Create a policy that allows anyone to view videos (since bucket is public)
CREATE POLICY "Allow public access to TV videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'tv');

-- Create a policy that allows anyone to upload videos
CREATE POLICY "Allow uploads to TV bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tv');

-- Create a policy that allows anyone to delete videos (for management)
CREATE POLICY "Allow deletes from TV bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'tv');
