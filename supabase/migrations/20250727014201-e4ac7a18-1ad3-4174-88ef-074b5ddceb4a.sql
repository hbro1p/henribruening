-- Fix security warnings detected in the linter

-- Fix the function search path issue by setting search_path properly
CREATE OR REPLACE FUNCTION public.log_storage_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
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
$$;