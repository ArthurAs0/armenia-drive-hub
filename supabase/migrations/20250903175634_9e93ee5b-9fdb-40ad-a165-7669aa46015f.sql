-- Create chats table for conversations between users
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chats
CREATE POLICY "Users can view chats they participate in" 
ON public.chats 
FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create chats as buyers" 
ON public.chats 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- Create policies for messages
CREATE POLICY "Users can view messages in their chats" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE chats.id = chat_id 
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

CREATE POLICY "Users can create messages in their chats" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE chats.id = chat_id 
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

-- Create trigger for automatic timestamp updates on chats
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_chats_buyer_id ON public.chats(buyer_id);
CREATE INDEX idx_chats_seller_id ON public.chats(seller_id);
CREATE INDEX idx_chats_car_id ON public.chats(car_id);
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);