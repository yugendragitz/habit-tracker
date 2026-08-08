# 🎯 Habit Tracker Dashboard

A premium, production-grade habit tracking web application built with **React**, **Tailwind CSS**, **GSAP animations**, and **Firebase Authentication & Cloud Storage**.

---

## 🌟 Key Features

### 📅 Daily Habit Tracking
Track 8 core daily habits:
- 😴 **Sleep** (7+ hrs)
- 🥗 **Clean Food**
- 💧 **Water Intake** (3L)
- 🏋️ **Gym**
- 🥊 **Boxing**
- 📚 **Study**
- 💡 **Skill Building**
- 🧘 **Self Care**

### 🔐 Authentication & Cloud Sync
- **Firebase Auth**: Support for Email/Password Sign-In & Sign-Up
- **Guest Mode**: Try out the app instantly with LocalStorage fallback
- **Firestore Cloud Sync**: Automatically sync habit data across devices when logged in

### 📊 Visual Analytics & Heatmaps
- **Circular Progress Ring**: Real-time animated overall completion percentage
- **Daily Completion Bars**: Breakdown of daily completion progress
- **14-Day Trend Chart**: Visual SVG line chart of performance over two weeks
- **Monthly Grid**: Calendar view with daily completion indicators
- **GitHub-style Heatmap**: Yearly contribution grid to track long-term consistency

### ✨ Dynamic Motion & Aesthetics
- **Canvas Particle Background**: Interactive animated background with subtle floating elements
- **GSAP Micro-Interactions**: Smooth staggered load animations, checkbox interactions, and state transitions
- **Glassmorphism UI**: Modern sleek dark theme with glowing neon accents and responsive layouts

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Functional UI components with Hooks & Context API |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS for styling and responsive layouts |
| **GSAP (GreenSock)** | High-performance micro-animations and transitions |
| **Firebase** | Authentication & Cloud Firestore database |
| **HTML5 Canvas** | Custom interactive background particle rendering |

---

## 📁 Project Structure

```text
habit-tracker-main/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx # HTML5 Canvas interactive background
│   │   ├── AuthScreen.jsx         # Firebase Auth modal (Sign-In / Sign-Up / Guest)
│   │   ├── DailyChart.jsx         # 14-day progress SVG trend line chart
│   │   ├── HabitCard.jsx          # Interactive habit toggle card
│   │   ├── Header.jsx             # Header with greeting, quote & auth status
│   │   ├── MonthGrid.jsx          # Calendar view for monthly performance
│   │   ├── MonthlyStats.jsx       # Monthly statistics dashboard panel
│   │   ├── ProgressBar.jsx        # Progress indicator bar
│   │   ├── ProgressRing.jsx       # Circular SVG animated progress indicator
│   │   ├── YearHeatmap.jsx        # GitHub-style annual contribution grid
│   │   └── YearlyProgress.jsx     # Yearly performance analytics panel
│   ├── config/
│   │   └── firebase.js            # Firebase app initialization & config
│   ├── context/
│   │   ├── AuthContext.jsx        # Firebase Authentication state context
│   │   └── MotionContext.jsx      # Global UI motion & layout animation context
│   ├── hooks/
│   │   ├── useAnimations.js       # Custom GSAP & Canvas hooks
│   │   ├── useGSAP.js             # GSAP timeline utility hook
│   │   └── useHabits.js           # Habit data state & cloud sync hook
│   ├── utils/
│   │   ├── cloudStorage.js        # Firestore sync helpers
│   │   ├── dateUtils.js           # Date formatting & calculations
│   │   ├── habits.js              # Core habit definitions & daily quotes
│   │   └── storageUtils.js        # LocalStorage fallback handlers
│   ├── App.jsx                    # Root App component assembling the layout
│   ├── index.css                  # Global Tailwind styles & theme variables
│   └── main.jsx                   # React DOM rendering entry point
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Run

1. **Clone the repository & enter the project directory:**
   ```bash
   cd habit-tracker-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to view the app.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🎨 Design System

- **Theme**: Dark Mode with Glassmorphism
- **Primary Accents**: Neon Emerald (`#00ffc8`), Electric Cyan, Cyber Violet
- **Font Family**: Inter, sans-serif
- **Interactions**: GSAP scale & glow effects on hover and toggle

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

