# Scheduler for Recurring Tasks

A Next.js application to schedule and keep track of recurring tests. Deployed on Vercel @ https://spur-take-home.vercel.app

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key
```

## Starting the API Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm run start
```
## File Structure

- /app/page.tsx: Primary calendar view for application, button to open Modal and save Modal data to Supabase
- /components/Calendar.tsx: skeleton structure for Calendar, populates Calendar View
- /components/Modal.tsx: skeleton structure of pop-up Modal that allows users to start a new Test Suite
- /hooks/useSchedule.ts: retrieves existing Events from supabase to populate Calendar 

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
