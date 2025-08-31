-- Enable RLS on public.test1 and add safe policies
-- This keeps reads working while blocking client-side writes

-- 1) Enable Row Level Security
ALTER TABLE public.test1 ENABLE ROW LEVEL SECURITY;

-- 2) Allow public read access (keeps current behavior if any UI reads exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'test1' AND policyname = 'Public can read test1'
  ) THEN
    CREATE POLICY "Public can read test1"
    ON public.test1
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Note: No INSERT/UPDATE/DELETE policies are added, so clients cannot modify data.
-- Service role (server-side) can still bypass RLS if needed.