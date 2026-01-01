create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  type text not null check (type in ('daily', 'weekly', 'monthly', 'yearly')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table todos enable row level security;

-- Create policies
create policy "Users can view their own todos"
  on todos for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own todos"
  on todos for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own todos"
  on todos for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own todos"
  on todos for delete
  using ( auth.uid() = user_id );
