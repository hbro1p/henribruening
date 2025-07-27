-- Security policy updates for storage buckets

-- Update bucket policies to be more restrictive
-- Delete existing policies first
DELETE FROM storage.objects WHERE bucket_id NOT IN ('fotos', 'pictures', 'music', 'tv', 'video-links', 'project-links');

-- Add additional security for private buckets
CREATE POLICY "Authenticated users only for fotos access"
ON storage.objects FOR ALL
USING (bucket_id = 'fotos' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'fotos' AND auth.role() = 'authenticated');

-- Ensure public buckets have proper size limits and file type restrictions
CREATE POLICY "File size and type limits for public buckets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('pictures', 'music', 'tv', 'video-links', 'project-links')
  AND (metadata->>'size')::bigint < 50000000 -- 50MB limit
  AND (
    bucket_id = 'pictures' AND (metadata->>'mimetype') LIKE 'image/%'
    OR bucket_id = 'music' AND (metadata->>'mimetype') LIKE 'audio/%'
    OR bucket_id = 'tv' AND (metadata->>'mimetype') LIKE 'video/%'
    OR bucket_id IN ('video-links', 'project-links') AND (metadata->>'mimetype') LIKE 'application/json'
  )
);

-- Create function to log storage access
CREATE OR REPLACE FUNCTION public.log_storage_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log storage operations for security monitoring
  INSERT INTO public.security_logs (
    event_type,
    details,
    created_at
  ) VALUES (
    TG_OP,
    jsonb_build_object(
      'bucket_id', COALESCE(NEW.bucket_id, OLD.bucket_id),
      'object_name', COALESCE(NEW.name, OLD.name),
      'user_id', auth.uid(),
      'timestamp', now()
    ),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create security logs table
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to security logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can insert security logs"
ON public.security_logs FOR INSERT
WITH CHECK (false); -- Only functions can insert

CREATE POLICY "No one can read security logs"
ON public.security_logs FOR SELECT
USING (false); -- Security logs are internal only

-- Create trigger for storage access logging
DROP TRIGGER IF EXISTS storage_access_log_trigger ON storage.objects;
CREATE TRIGGER storage_access_log_trigger
  AFTER INSERT OR UPDATE OR DELETE ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION public.log_storage_access();