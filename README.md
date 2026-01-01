# 🎯 Goal

Goal is a premium, responsive task management application designed for high productivity. Built with **Next.js 15** and **Supabase**, it features a refined Eisenhower-style quadrant system to help you organize personal objectives into **Daily**, **Weekly**, **Monthly**, and **Yearly** horizons.

## ✨ Features

- **🛡️ Secure Authentication**: Full multi-user support with Supabase Auth (Email/Password & Google OAuth).
- **🔒 Privacy & Security**: 
    - **Row Level Security (RLS)**: Physical data isolation ensures you only ever see your own data.
    - **Encryption**: Data is encrypted at rest by default.
- **🎨 Premium UI/UX**:
    - **Dynamic Themes**: Seamless Dark and Light mode support using `next-themes`.
    - **Optimistic Updates**: Instant feedback for adding, toggling, and editing tasks.
    - **Intuitive Interactions**:
        - **Double-click** any quadrant to expand.
        - **Click outside** to collapse back to grid view.
        - **Inline Editing**: Just click a task name to edit it instantly.
    - **Smart Organization**: Clear separation between active and completed tasks in expanded views.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Backend/Auth/DB**: [Supabase](https://supabase.com/) (`@supabase/ssr`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Theme Management**: `next-themes`
- **Icons**: `lucide-react`
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase project

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bjadhs/goal.git
   cd goal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Migration:**
   Apply the SQL schemas in your Supabase SQL Editor:
   - `schema.sql`: Sets up the `todos` table and RLS policies.
   - `schema_details.sql`: Sets up the `quadrant_details` table for custom subtitles.

5. **Run Locally:**
   ```bash
   npm run dev
   ```

## 📜 License

MIT License. Designed with ❤️ for productivity.

