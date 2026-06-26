-- iThink Logistics integration support.
-- Run this in Supabase SQL Editor before enabling shipment creation.

alter table public.orders
  add column if not exists awb_number text,
  add column if not exists shipment_id text,
  add column if not exists courier_name text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists shipment_status text,
  add column if not exists shipping_label_url text,
  add column if not exists invoice_url text,
  add column if not exists shipment_created_at timestamptz,
  add column if not exists ithink_shipment_response jsonb,
  add column if not exists ithink_tracking_response jsonb,
  add column if not exists ithink_shipment_error text;

create table if not exists public.shipment_api_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  provider text not null default 'ithink',
  operation text not null,
  success boolean not null default false,
  status_code integer,
  request_payload jsonb,
  response_payload jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_awb_number on public.orders(awb_number);
create index if not exists idx_orders_shipment_status on public.orders(shipment_status);
create index if not exists idx_shipment_api_logs_order_id on public.shipment_api_logs(order_id);
create index if not exists idx_shipment_api_logs_created_at on public.shipment_api_logs(created_at desc);

alter table public.shipment_api_logs enable row level security;

drop policy if exists "Users can view shipment logs for their orders" on public.shipment_api_logs;
create policy "Users can view shipment logs for their orders"
on public.shipment_api_logs for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = shipment_api_logs.order_id
      and orders.user_id = (select auth.uid())
  )
);

grant select on public.shipment_api_logs to authenticated;

