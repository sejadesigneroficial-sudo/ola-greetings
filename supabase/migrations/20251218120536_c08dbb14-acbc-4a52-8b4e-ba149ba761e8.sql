-- Enable realtime for arremates table
ALTER TABLE public.arremates REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.arremates;