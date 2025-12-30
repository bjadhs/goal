# Goal

Goal is a modern, responsive task management application built with **Next.js** and **Supabase**. It helps you organize your objectives into four key timeframes: **Daily**, **Weekly**, **Monthly**, and **Yearly**, providing a clear overview of your progress across different horizons.

## Features

- **Quadrant View**: Clearly separate tasks by timeframe (Daily, Weekly, Monthly, Yearly).
- **Persistent Storage**: All data is securely stored in a Supabase PostgreSQL database.
- **Optimistic UI**: Instant feedback on user actions (add, toggle, delete) for a snappy experience.
- **Responsive Design**: Built with Tailwind CSS to look great on all devices.
- **Real-time**: Leverages Supabase for data management.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bjadhs/goal.git
   cd goal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials. You can find these in your Supabase project settings.

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   > **Note:** See `DEPLOYMENT.md` for example configuration values.

4. **Database Setup:**
   Run the SQL commands found in `schema.sql` in your Supabase project's SQL Editor to create the necessary table and security policies.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

For detailed deployment instructions, including how to deploy to Vercel, Netlify, or Railway, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## License

This project is licensed under the MIT License.
