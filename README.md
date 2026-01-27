# Habit Tracker Dashboard

A premium, production-grade habit tracking web application built with React, Tailwind CSS, and GSAP animations.

## Features

- **8 Daily Habits to Track**
  - Sleep (7+ hrs)
  - Clean Food
  - Water Intake (3L)
  - Gym
  - Boxing
  - Study
  - Skill Building
  - Self Care

- **Visual Analytics**
  - Animated circular progress ring
  - Daily completion progress bars
  - 14-day trend line chart
  - Monthly calendar grids
  - GitHub-style yearly heatmap

- **Smooth Animations**
  - GSAP-powered micro-interactions
  - Staggered page load animations
  - Real-time progress updates
  - Premium checkbox animations

- **Data Persistence**
  - localStorage-based storage
  - Keyed by date (YYYY-MM-DD)
  - Automatic date change detection
  - No backend required

## Tech Stack

- **React 18** - Functional components with hooks
- **Tailwind CSS** - Modern, responsive design
- **GSAP** - Smooth, premium animations
- **Vite** - Fast development and build

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel

This project is ready to deploy on Vercel without any configuration changes.

1. Push to GitHub
2. Import to Vercel
3. Deploy!

Or use Vercel CLI:

```bash
npx vercel
```

## Project Structure

```
src/
├── components/
│   ├── DailyChart.jsx      # Line chart for daily progress
│   ├── HabitCard.jsx       # Individual habit toggle card
│   ├── Header.jsx          # Date and greeting header
│   ├── MonthGrid.jsx       # Calendar grid for a month
│   ├── MonthlyStats.jsx    # Monthly analytics panel
│   ├── ProgressBar.jsx     # Horizontal progress bar
│   ├── ProgressRing.jsx    # Circular progress indicator
│   ├── YearHeatmap.jsx     # GitHub-style contribution grid
│   └── YearlyProgress.jsx  # Yearly statistics panel
├── hooks/
│   ├── useGSAP.js          # GSAP animation utilities
│   └── useHabits.js        # Habit state management
├── utils/
│   ├── dateUtils.js        # Date formatting and calculations
│   ├── habits.js           # Habit definitions and quotes
│   └── storageUtils.js     # localStorage operations
├── App.jsx                 # Main application component
├── index.css               # Global styles and Tailwind
└── main.jsx               # React entry point
```

## Design System

- **Theme**: Dark mode with glassmorphism
- **Accent Color**: Neon green (#00ffc8) with cyan gradients
- **Typography**: Inter font family
- **Cards**: Rounded corners with subtle borders
- **Shadows**: Soft glows on interactive elements

## License

MIT
