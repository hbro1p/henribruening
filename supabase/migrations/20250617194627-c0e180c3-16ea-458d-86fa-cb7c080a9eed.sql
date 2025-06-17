
-- Create storage buckets for video and project links
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('video-links', 'video-links', true),
  ('project-links', 'project-links', true);

-- Create policies for the video-links bucket
CREATE POLICY "Anyone can view video links" ON storage.objects
  FOR SELECT USING (bucket_id = 'video-links');

CREATE POLICY "Anyone can insert video links" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'video-links');

CREATE POLICY "Anyone can update video links" ON storage.objects
  FOR UPDATE USING (bucket_id = 'video-links');

CREATE POLICY "Anyone can delete video links" ON storage.objects
  FOR DELETE USING (bucket_id = 'video-links');

-- Create policies for the project-links bucket
CREATE POLICY "Anyone can view project links" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-links');

CREATE POLICY "Anyone can insert project links" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-links');

CREATE POLICY "Anyone can update project links" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-links');

CREATE POLICY "Anyone can delete project links" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-links');
