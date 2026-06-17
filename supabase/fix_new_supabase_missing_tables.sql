-- Run this in the NEW Supabase project's SQL Editor.
-- It fixes the current new-project state where products/cart/orders exist,
-- but addresses, profiles, wishlist, and coupons are missing from the API.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  address_line_1 text not null,
  address_line_2 text,
  landmark text,
  city text not null,
  state text not null,
  pincode text not null,
  country text default 'India',
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default now()
);

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text,
  product_image text,
  product_price numeric,
  created_at timestamptz default timezone('utc'::text, now()),
  product_id uuid not null references public.products(id) on delete cascade,
  constraint wishlist_user_product_unique unique (user_id, product_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('fixed', 'percentage', 'free_shipping', 'final_price')),
  discount_value integer not null default 0 check (discount_value >= 0),
  min_order integer not null default 0 check (min_order >= 0),
  active boolean not null default true,
  expiry_date timestamp,
  created_at timestamp not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default timezone('utc'::text, now())
);

create index if not exists idx_profiles_id on public.profiles(id);
create index if not exists idx_addresses_user_id on public.addresses(user_id);
create index if not exists idx_wishlist_user_id on public.wishlist(user_id);

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.coupons to anon, authenticated;
grant select, insert, update, delete on public.cart to authenticated;
grant select, insert, delete on public.wishlist to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;

alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.cart enable row level security;
alter table public.wishlist enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
on public.products for select
using (true);

drop policy if exists "Public can read coupons for validation" on public.coupons;
create policy "Public can read coupons for validation"
on public.coupons for select
using (true);

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users can view their addresses" on public.addresses;
create policy "Users can view their addresses"
on public.addresses for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their addresses" on public.addresses;
create policy "Users can insert their addresses"
on public.addresses for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their addresses" on public.addresses;
create policy "Users can update their addresses"
on public.addresses for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their addresses" on public.addresses;
create policy "Users can delete their addresses"
on public.addresses for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can view their wishlist" on public.wishlist;
create policy "Users can view their wishlist"
on public.wishlist for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their wishlist" on public.wishlist;
create policy "Users can insert their wishlist"
on public.wishlist for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their wishlist" on public.wishlist;
create policy "Users can delete their wishlist"
on public.wishlist for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create policy "Anyone can insert contact messages"
on public.contact_messages for insert
with check (true);

drop policy if exists "Users can view their contact messages" on public.contact_messages;
create policy "Users can view their contact messages"
on public.contact_messages for select
to authenticated
using (auth.uid() = user_id);

-- Seed default coupons if coupons table is empty.
insert into public.coupons (code, discount_type, discount_value, min_order, active)
select * from (
  values
    ('MAY500', 'fixed', 500, 1499, true),
    ('GLOW10', 'percentage', 10, 0, true),
    ('FIRST20', 'percentage', 20, 0, true),
    ('VIP2026', 'final_price', 1, 0, true)
) as seed(code, discount_type, discount_value, min_order, active)
where not exists (select 1 from public.coupons)
on conflict (code) do nothing;

commit;
