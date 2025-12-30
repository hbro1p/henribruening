-- Create table for TikTok video mappings for the Strava 2026 challenge
CREATE TABLE public.strava_challenge_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 365),
  tiktok_url TEXT NOT NULL,
  tiktok_title TEXT,
  tiktok_thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.strava_challenge_videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view)
CREATE POLICY "Anyone can view challenge videos" 
ON public.strava_challenge_videos 
FOR SELECT 
USING (true);

-- No insert/update/delete policies - data is managed via admin/edge functions only

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_strava_challenge_videos_updated_at
BEFORE UPDATE ON public.strava_challenge_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups by day number
CREATE INDEX idx_strava_challenge_videos_day ON public.strava_challenge_videos(day_number);

-- Insert some sample data for testing (first few days)
INSERT INTO public.strava_challenge_videos (day_number, tiktok_url, tiktok_title) VALUES
(1, 'https://www.tiktok.com/@henri.running/video/placeholder1', 'Day 1 – 5K done'),
(2, 'https://www.tiktok.com/@henri.running/video/placeholder2', 'Day 2 – 5K done'),
(3, 'https://www.tiktok.com/@henri.running/video/placeholder3', 'Day 3 – 5K done');