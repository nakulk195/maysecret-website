create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('fixed', 'percentage', 'free_shipping')),
  discount_value integer not null default 0 check (discount_value >= 0),
  min_order integer not null default 0 check (min_order >= 0),
  active boolean not null default true,
  expiry_date timestamp,
  created_at timestamp not null default now()
);

alter table public.coupons enable row level security;

grant select on public.coupons to anon, authenticated;

drop policy if exists "Public can read coupons for validation" on public.coupons;
create policy "Public can read coupons for validation"
  on public.coupons
  for select
  using (true);

insert into public.coupons (code, discount_type, discount_value, min_order, active)
values
  ('MAY500', 'fixed', 500, 1499, true),
  ('GLOW10', 'percentage', 10, 0, true),
  ('FIRST20', 'percentage', 20, 0, true)
on conflict (code) do update
set
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_order = excluded.min_order,
  active = excluded.active;
