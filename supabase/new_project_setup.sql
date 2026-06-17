-- Fresh Supabase project setup for MAY SECRET.
-- Run this in the new Supabase project's SQL Editor before importing CSV data.
-- User-owned CSV rows need matching auth.users IDs. If you are not migrating Auth users,
-- import only products_rows.csv and coupons_rows.csv.

begin;

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  image text,
  category text,
  stock integer default 0,
  created_at timestamptz default timezone('utc'::text, now()),
  original_price numeric,
  is_featured boolean default true,
  rating numeric default 4.8,
  reviews integer default 0,
  updated_at timestamptz default now(),
  product_number bigserial not null
);

create unique index if not exists products_product_number_key
  on public.products(product_number);

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

create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text,
  product_image text,
  product_price numeric,
  quantity integer not null default 1 check (quantity >= 1),
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default now(),
  product_id uuid not null references public.products(id) on delete cascade,
  constraint cart_user_product_unique unique (user_id, product_id)
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

create sequence if not exists public.orders_order_number_seq start with 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  total_amount numeric not null default 0,
  payment_status text default 'pending',
  order_status text default 'processing',
  address text,
  created_at timestamptz default timezone('utc'::text, now()),
  order_number bigint not null default nextval('public.orders_order_number_seq'),
  razorpay_order_id text,
  razorpay_signature text,
  address_id uuid references public.addresses(id) on delete set null,
  payment_id text,
  status text default 'pending',
  payment_method text default 'Razorpay'
);

create unique index if not exists orders_order_number_key
  on public.orders(order_number);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  quantity integer default 1,
  price numeric default 0,
  product_id uuid references public.products(id) on delete set null,
  product_number bigint,
  product_name text,
  product_image text,
  product_price numeric
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

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_cart_user_id on public.cart(user_id);
create index if not exists idx_wishlist_user_id on public.wishlist(user_id);
create index if not exists idx_addresses_user_id on public.addresses(user_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

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
grant usage, select on sequence public.products_product_number_seq to authenticated;
grant usage, select on sequence public.orders_order_number_seq to authenticated;

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

drop policy if exists "Users can view their cart" on public.cart;
create policy "Users can view their cart"
on public.cart for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their cart" on public.cart;
create policy "Users can insert their cart"
on public.cart for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their cart" on public.cart;
create policy "Users can update their cart"
on public.cart for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their cart" on public.cart;
create policy "Users can delete their cart"
on public.cart for delete
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

drop policy if exists "Users can view their orders" on public.orders;
create policy "Users can view their orders"
on public.orders for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their orders" on public.orders;
create policy "Users can insert their orders"
on public.orders for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their orders" on public.orders;
create policy "Users can update their orders"
on public.orders for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view their order items" on public.order_items;
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

drop policy if exists "Users can insert their order items" on public.order_items;
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

drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create policy "Anyone can insert contact messages"
on public.contact_messages for insert
with check (true);

drop policy if exists "Users can view their contact messages" on public.contact_messages;
create policy "Users can view their contact messages"
on public.contact_messages for select
to authenticated
using (auth.uid() = user_id);

commit;
