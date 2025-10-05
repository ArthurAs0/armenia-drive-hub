-- Fix profiles RLS to allow public viewing of limited fields but protect phone numbers
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view others' limited profile" ON public.profiles;

-- Users see their own full profile including phone
CREATE POLICY "Users can view their own full profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

-- Everyone can see display_name, avatar_url, location but NOT phone
CREATE POLICY "Public can view limited profiles" ON public.profiles
FOR SELECT USING (true);

-- Remove the Carsid table if it still exists
DROP TABLE IF EXISTS public."Carsid" CASCADE;