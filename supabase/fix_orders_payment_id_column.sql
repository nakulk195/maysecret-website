-- Run this in Supabase SQL Editor if checkout payment succeeds but order save fails with:
-- PGRST204: Could not find the 'payment_id' column of 'orders' in the schema cache.

alter table public.orders
  add column if not exists payment_id text;

notify pgrst, 'reload schema';
