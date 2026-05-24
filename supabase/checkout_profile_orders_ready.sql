-- Run this once in Supabase SQL Editor after the cart/wishlist cleanup.
-- It prepares profile, address, order, order_items, and contact data for production use.

begin;

-- Keep useful order identifiers and payment fields.
create sequence if not exists public.orders_order_number_seq start with 1001;

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists total_amount numeric default 0,
  add column if not exists status text default 'pending',
  add column if not exists shipping_address jsonb,
  add column if not exists order_number bigint,
  add column if not exists payment_id text,
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_signature text,
  add column if not exists payment_status text default 'pending',
  add column if not exists order_status text default 'processing',
  add column if not exists address_id uuid references public.addresses(id) on delete set null;

update public.orders
set order_number = nextval('public.orders_order_number_seq')
where order_number is null;

alter table public.orders
  alter column order_number set default nextval('public.orders_order_number_seq'),
  alter column status set default 'pending',
  alter column payment_status set default 'pending',
  alter column order_status set default 'processing';

create unique index if not exists orders_order_number_key
on public.orders(order_number);

alter table public.order_items
  add column if not exists order_id uuid references public.orders(id) on delete cascade,
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists quantity integer default 1,
  add column if not exists price numeric default 0,
  add column if not exists product_name text,
  add column if not exists product_image text,
  add column if not exists product_price numeric;

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, insert, update, delete on public.cart to authenticated;
grant select, insert, update, delete on public.wishlist to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant select, insert on public.contact_messages to authenticated;
grant usage, select on sequence public.orders_order_number_seq to authenticated;

-- Helpful profile columns for OAuth users.
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists updated_at timestamptz default now();

-- Remove orphaned user-owned data only. This does not drop useful tables.
delete from public.order_items oi
where not exists (
  select 1 from public.orders o where o.id = oi.order_id
);

delete from public.orders o
where not exists (
  select 1 from auth.users u where u.id = o.user_id
);

delete from public.addresses a
where not exists (
  select 1 from auth.users u where u.id = a.user_id
);

delete from public.profiles p
where not exists (
  select 1 from auth.users u where u.id = p.id
);

delete from public.contact_messages cm
where cm.user_id is not null
  and not exists (
    select 1 from auth.users u where u.id = cm.user_id
  );

-- RLS policies: every user can only access their own private data.
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname from pg_policies where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', policy_record.policyname);
  end loop;
end $$;

create policy "Users can view their profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert their profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname from pg_policies where schemaname = 'public' and tablename = 'addresses'
  loop
    execute format('drop policy if exists %I on public.addresses', policy_record.policyname);
  end loop;
end $$;

create policy "Users can view their addresses"
on public.addresses for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their addresses"
on public.addresses for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their addresses"
on public.addresses for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their addresses"
on public.addresses for delete
to authenticated
using (auth.uid() = user_id);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname from pg_policies where schemaname = 'public' and tablename = 'orders'
  loop
    execute format('drop policy if exists %I on public.orders', policy_record.policyname);
  end loop;
end $$;

create policy "Users can view their orders"
on public.orders for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their orders"
on public.orders for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their orders"
on public.orders for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname from pg_policies where schemaname = 'public' and tablename = 'order_items'
  loop
    execute format('drop policy if exists %I on public.order_items', policy_record.policyname);
  end loop;
end $$;

create policy "Users can view their order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "Users can insert their order items"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname from pg_policies where schemaname = 'public' and tablename = 'contact_messages'
  loop
    execute format('drop policy if exists %I on public.contact_messages', policy_record.policyname);
  end loop;
end $$;

create policy "Users can insert contact messages"
on public.contact_messages for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their contact messages"
on public.contact_messages for select
to authenticated
using (auth.uid() = user_id);

commit;
