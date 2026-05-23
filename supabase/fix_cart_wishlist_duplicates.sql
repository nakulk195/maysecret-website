-- Run this once in Supabase SQL Editor before deploying the fixed app.
-- It removes accidental duplicate cart/wishlist rows and enforces one row per user/product.

begin;

delete from public.cart
where user_id is null
   or product_id is null;

update public.cart
set quantity = 1
where quantity is null
   or quantity < 1;

with ranked_cart as (
  select
    id,
    row_number() over (
      partition by user_id, product_id
      order by created_at asc, id asc
    ) as row_number
  from public.cart
)
delete from public.cart
using ranked_cart
where public.cart.id = ranked_cart.id
  and ranked_cart.row_number > 1;

alter table public.cart
  alter column user_id set not null,
  alter column product_id set not null,
  alter column quantity set default 1,
  alter column quantity set not null;

alter table public.cart
  drop constraint if exists cart_user_product_unique;

alter table public.cart
  add constraint cart_user_product_unique unique (user_id, product_id);

alter table public.cart
  drop constraint if exists cart_quantity_positive;

alter table public.cart
  add constraint cart_quantity_positive check (quantity >= 1);

delete from public.wishlist
where user_id is null
   or product_id is null;

with ranked_wishlist as (
  select
    id,
    row_number() over (
      partition by user_id, product_id
      order by created_at asc, id asc
    ) as row_number
  from public.wishlist
)
delete from public.wishlist
using ranked_wishlist
where public.wishlist.id = ranked_wishlist.id
  and ranked_wishlist.row_number > 1;

alter table public.wishlist
  alter column user_id set not null,
  alter column product_id set not null;

alter table public.wishlist
  drop constraint if exists wishlist_user_product_unique;

alter table public.wishlist
  add constraint wishlist_user_product_unique unique (user_id, product_id);

alter table public.cart enable row level security;
alter table public.wishlist enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'cart'
  loop
    execute format('drop policy if exists %I on public.cart', policy_record.policyname);
  end loop;
end $$;

create policy "Users can view their cart"
on public.cart for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their cart"
on public.cart for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their cart"
on public.cart for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their cart"
on public.cart for delete
to authenticated
using (auth.uid() = user_id);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'wishlist'
  loop
    execute format('drop policy if exists %I on public.wishlist', policy_record.policyname);
  end loop;
end $$;

create policy "Users can view their wishlist"
on public.wishlist for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their wishlist"
on public.wishlist for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their wishlist"
on public.wishlist for delete
to authenticated
using (auth.uid() = user_id);

commit;
