-- Run this once in Supabase SQL Editor before using Cash on Delivery orders.
-- It adds the payment method field used by the checkout flow.

begin;

alter table public.orders
  add column if not exists payment_method text default 'Razorpay',
  alter column payment_method set default 'Razorpay';

grant select, insert, update on public.orders to authenticated;

commit;
