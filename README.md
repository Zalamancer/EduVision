# EduVision

**AI-powered digital logic education platform.** Learn gates and Boolean algebra through interactive SVG circuit simulations, structured video lessons, and an AI tutor powered by Claude.

## Features

- **Live Circuit Simulator** — drag-and-drop SVG-based circuit editor with real-time signal propagation
- **Video Lessons** — 8-episode Chapter 1 covering AND, OR, NOT, NAND, NOR, XOR, half adder, full adder
- **AI Tutor** — ask Claude to build circuits from text, explain designs, or debug issues
- **Truth Table Generator** — auto-generates truth tables for any circuit in real time
- **Challenges** — guided exercises with answer validation and confetti on success
- **Example Circuits** — half adder, full adder, 2-to-1 mux, AND-from-NAND
- **Auth & Save** — Supabase auth (email + Google), save/load circuits to database

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 + TypeScript + App Router |
| Styling | Tailwind CSS + shadcn/ui (dark theme) |
| State | Zustand |
| Simulator | Client-side SVG + TypeScript propagation engine |
| AI | Anthropic Claude Sonnet (`@anthropic-ai/sdk`) |
| Backend | Supabase (Auth + PostgreSQL + RLS) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- An Anthropic API key

### Setup

```bash
cd ~/EduVision
npm install
cp .env.local.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-your-key
```

### Database Setup

Run the migration in your Supabase SQL editor:

```bash
# Copy contents of supabase/migrations/001_initial.sql
# Paste into Supabase SQL editor and run
```

## Project Structure

```
app/
  page.tsx              # Landing page
  simulator/page.tsx    # Circuit simulator
  learn/page.tsx        # Episode list
  learn/[id]/page.tsx   # Episode player
  challenge/[slug]/     # Challenge page
  dashboard/page.tsx    # User dashboard
  login/page.tsx        # Auth page
  api/ai/               # Claude API routes

components/
  simulator/            # Canvas, gates, toolbar, AI chat
  video/                # Video player
  layout/               # Header

lib/
  sim-engine/           # Circuit data model + propagation
  stores/               # Zustand stores
  episodes-data.ts      # Chapter 1 episode data
  challenges-data.ts    # Challenge definitions

public/examples/        # Preloaded circuit JSON files
supabase/migrations/    # SQL migration files
```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Delete` | Remove selected component/wire |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Escape` | Deselect / cancel wire |

## Simulator Usage

1. **Place a component**: Click a gate in the left sidebar, then click on the canvas
2. **Connect wires**: Click an output pin (right side of gate), then click an input pin
3. **Toggle inputs**: Click an INPUT switch to flip it between 0 and 1
4. **Delete**: Press Delete key, or use the delete tool
5. **Pan**: Drag the canvas background
6. **Zoom**: Scroll wheel

## Deployment (Vercel)

```bash
vercel deploy
```

Add environment variables in Vercel project settings.

## Color Palette

| Name | Hex |
|---|---|
| Background | `#0A0A1A` |
| Surface | `#12122A` |
| Border | `#1E1E3A` |
| Primary | `#58C4DD` |
| Signal HIGH | `#83C167` |
| Signal LOW | `#4A4A5A` |
| Error | `#FC6255` |
| Accent | `#FFFF00` |

## License

MIT
