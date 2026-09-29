# TeenTrack Frontend ⚡

> **Live Deployed App**: [https://teentracker-fronted.vercel.app/login](https://teentracker-fronted.vercel.app/login)  
> **Backend API**: [https://teentracker-backend-u8gt.onrender.com/api](https://teentracker-backend-u8gt.onrender.com/api)  
> **Repository**: [https://github.com/SHADOW-SPACE-UI/TEENTRACKER-FRONTED](https://github.com/SHADOW-SPACE-UI/TEENTRACKER-FRONTED)

Modern, responsive Single Page Application built with React 18, Vite, React Router, Recharts, and Axios.

## Features
- **Integrated Dashboard**: Combines financial cashflow and daily habit metrics.
- **Graphical Analytics**: 5 professional Recharts visualizers (Category Donut, Spending Timeline, Category Bar, Budget vs Actual, Savings Trend).
- **Dark, Light & System Themes**: Smooth CSS variable design system persisting user preference.
- **Mobile First Design**: Touch-friendly navigation bar, quick actions, responsive layouts.
- **Productivity & Streak**: Completed task streak counter with an option to toggle off for mental wellness.
- **Linked Money + Tasks**: Connect saving goals with action items (e.g., price comparison, saving milestones).

## Folder Structure
```
frontend/
├── public/             # Static public assets
├── src/
│   ├── components/     # Reusable UI components (Cards, Tables, Modals, Forms)
│   ├── pages/          # Full page views (Dashboard, Expenses, Tasks, Budget, etc.)
│   ├── layouts/        # Layout with desktop sidebar, header, and mobile navbar
│   ├── charts/         # Recharts graph components
│   ├── context/        # AuthContext, ThemeContext, ToastContext
│   ├── services/       # Axios API services
│   ├── utils/          # Currency formatters, date utilities, category styling
│   ├── constants/      # Categories, payment options, priority levels
│   ├── App.jsx         # App router and providers
│   └── main.jsx        # Entrypoint
├── package.json
└── vite.config.js
```

## Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

# TEENTRACKER-FRONTED
