create table if not exists quadrant_details (
  type text primary key check (type in ('daily', 'weekly', 'monthly', 'yearly')),
  subtitle text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table quadrant_details enable row level security;

-- Policy (public for now as per previous pattern)
create policy "Allow public access to details" on quadrant_details for all using (true);
