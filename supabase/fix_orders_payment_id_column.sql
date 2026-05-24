-- Run this in Supabase SQL Editor if checkout payment succeeds but order save fails with:
-- PGRST204: Could not find the 'payment_id' column of 'orders' in the schema cache.

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists total_amount numeric default 0,
  add column if not exists status text default 'pending',
  add column if not exists payment_id text,
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_signature text,
  add column if not exists address_id uuid references public.addresses(id) on delete set null;

grant select, insert, update on public.orders to authenticated;

notify pgrst, 'reload schema';
