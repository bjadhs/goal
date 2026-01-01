create table quadrant_details (
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('daily', 'weekly', 'monthly', 'yearly')),
  subtitle text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, type)
);

-- Enable RLS
alter table quadrant_details enable row level security;

-- Create policies
create policy "Users can view their own quadrant details"
  on quadrant_details for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own quadrant details"
  on quadrant_details for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own quadrant details"
  on quadrant_details for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own quadrant details"
  on quadrant_details for delete
  using ( auth.uid() = user_id );
