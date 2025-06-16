
-- Create the pictures bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('pictures', 'pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies to allow public access to pictures
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'pictures');

CREATE POLICY "Anyone can upload pictures" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pictures');

CREATE POLICY "Anyone can update pictures" ON storage.objects
FOR UPDATE USING (bucket_id = 'pictures');

CREATE POLICY "Anyone can delete pictures" ON storage.objects
FOR DELETE USING (bucket_id = 'pictures');
