
-- Create a storage bucket for music files
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to view music files
CREATE POLICY "Public Access Music" ON storage.objects
FOR SELECT USING (bucket_id = 'music');

-- Create policy to allow public access to insert music files
CREATE POLICY "Public Upload Music" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'music');

-- Create policy to allow public access to update music files
CREATE POLICY "Public Update Music" ON storage.objects
FOR UPDATE USING (bucket_id = 'music');

-- Create policy to allow public access to delete music files
CREATE POLICY "Public Delete Music" ON storage.objects
FOR DELETE USING (bucket_id = 'music');
