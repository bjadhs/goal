create table todos (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  completed boolean default false,
  type text not null check (type in ('daily', 'weekly', 'monthly', 'yearly')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table todos enable row level security;

-- Create a policy that allows all operations for now (since we don't have auth yet)
-- In a real app with auth, you'd restrict this to the authenticated user
create policy "Allow public access" on todos for all using (true);
