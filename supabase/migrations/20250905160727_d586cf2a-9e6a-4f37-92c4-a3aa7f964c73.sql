-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;
SELECT supabase_realtime.add_table_to_publication('supabase_realtime', 'messages');