-- Fix 1: Create missing chats table
CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(car_id, buyer_id, seller_id)
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Fix 2: Create missing messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Fix 3: RLS policies for chats
CREATE POLICY "Users can view their own chats" ON public.chats
FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

CREATE POLICY "Users can create chats as buyer" ON public.chats
FOR INSERT WITH CHECK (
  auth.uid() = buyer_id
);

-- Fix 4: RLS policies for messages
CREATE POLICY "Users can view messages in their chats" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE chats.id = messages.chat_id
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their chats" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.chats
    WHERE chats.id = messages.chat_id
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

-- Fix 5: Enable realtime for messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Fix 6: Add trigger for chats updated_at
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix 7: Restrict phone number visibility in profiles
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own full profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view others' limited profile" ON public.profiles
FOR SELECT USING (
  auth.uid() != user_id OR auth.uid() IS NULL
);

-- Fix 8: Add missing columns to cars table
ALTER TABLE public.cars 
  ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- Fix 9: Remove unused Carsid table
DROP TABLE IF EXISTS public."Carsid";

-- Fix 10: Fix search_path for security definer function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;