# Analytics Dashboard - AI-Powered Data Analysis Platform

A modern, full-featured analytics dashboard built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, featuring AI-powered insights, file upload analysis, and beautiful data visualizations.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Core Features

### � File Upload & Analysis
- **Drag & Drop Interface** - Intuitive file upload with hover effects
- **Supported Formats** - Excel (.xlsx, .xls) and PDF files
- **File Validation** - Real-time validation with error messages
- **File Preview** - Display file name, size, and type before analysis

### ⚡ Smart Processing
- **Animated Loader** - Beautiful Framer Motion animations during analysis
- **Progress Tracking** - Real-time progress bar with status messages
- **Multi-Stage Processing** - "Extracting insights...", "Processing with AI...", "Generating visuals..."
- **Simulated AI Analysis** - Demonstrates the analysis workflow

### 📊 Dashboard Features

#### Key Metrics Cards
- Total Revenue with trend indicators
- Active Users tracking
- Total Orders monitoring
- Conversion Rate analytics

#### Data Visualizations
- **Revenue Overview** - Interactive area chart showing monthly trends
- **User Activity** - Dual-line chart for active vs new users
- **Top Products Table** - Performance metrics with sales data

#### 🤖 AI-Generated Insights
- Performance trend analysis
- Attention alerts for metrics
- Optimization opportunities
- Intelligent recommendations

### 🎨 Modern UI/UX
- **Sleek Sidebar Navigation** - Dashboard, Upload, Reports, Settings
- **Top Navigation Bar** - Search, notifications, theme toggle, user profile
- **Dark/Light Mode** - Persistent theme switching with smooth transitions
- **Glassmorphism Design** - Soft shadows, rounded cards, gradient backgrounds
- **Responsive Layout** - Works seamlessly on all devices
- **Empty States** - Friendly messages with animations
- **Error Handling** - Clear feedback for invalid file types

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **File Upload**: [React Dropzone](https://react-dropzone.js.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **UI Components**: Custom components with shadcn/ui patterns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd analytics-dashboard
```

2. Install dependencies (already done):
```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the analytics dashboard

## Available Scripts

- `npm run dev` - Start development server with Turbopack (recommended)
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 How to Use

### Upload & Analyze Files

1. Navigate to the **Upload** page from the sidebar
2. **Drag and drop** an Excel (.xlsx, .xls) or PDF file
3. Click **Analyze** to process the file
4. Watch the animated progress as AI analyzes your data
5. View insights on the **Dashboard**

### Navigate the Dashboard

- **Dashboard** - View all analytics and AI insights
- **Upload** - Upload new files for analysis
- **Reports** - (Coming soon) Download and manage reports
- **Settings** - (Coming soon) Configure preferences

### Toggle Theme

Click the **moon/sun icon** in the top bar to switch between light and dark modes. Your preference is saved automatically.

## VS Code Integration

This project includes VS Code tasks for easy development:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Run Dev Server" to start the development server

## Project Structure

```
analytics-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with sidebar & topbar
│   │   ├── page.tsx                # Dashboard page with conditional rendering
│   │   ├── upload/
│   │   │   └── page.tsx            # File upload page
│   │   ├── reports/
│   │   │   └── page.tsx            # Reports page (placeholder)
│   │   ├── settings/
│   │   │   └── page.tsx            # Settings page (placeholder)
│   │   └── globals.css             # Global styles with CSS variables
│   ├── components/
│   │   ├── ui/
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── button.tsx          # Button component
│   │   │   └── input.tsx           # Input component
│   │   ├── layout/
│   │   │   ├── sidebar.tsx         # Navigation sidebar
│   │   │   └── topbar.tsx          # Top navigation bar
│   │   ├── upload/
│   │   │   ├── file-upload.tsx     # Drag-drop file upload
│   │   │   └── analyzing-loader.tsx # Animated analysis loader
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx         # Metrics cards
│   │   │   ├── revenue-chart.tsx       # Revenue visualization
│   │   │   ├── user-activity-chart.tsx # User activity chart
│   │   │   ├── top-products-table.tsx  # Products table
│   │   │   ├── ai-insights.tsx         # AI insights section
│   │   │   └── empty-state.tsx         # Empty state component
│   │   └── theme-provider.tsx      # Theme context provider
│   ├── store/
│   │   └── useAppStore.ts          # Zustand state management
│   └── lib/
│       └── utils.ts                # Utility functions
├── public/                         # Static assets
├── .vscode/                        # VS Code configuration
│   └── tasks.json                  # Build & run tasks
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── next.config.ts                 # Next.js configuration
```

## Customization

### Adding New Charts

1. Create a new component in `src/components/dashboard/`
2. Import and use Recharts components
3. Add the component to `src/app/page.tsx`

### Styling & Theming

- **Modify Colors**: Update CSS variables in `src/app/globals.css`
- **Tailwind Config**: Customize `tailwind.config.ts` for colors and themes
- **Dark Mode**: Colors automatically adjust based on theme

### Data Integration

Replace the static data in dashboard components with your own data sources:
- **API Integration**: Use Next.js API routes or server actions
- **Database**: Connect to PostgreSQL, MongoDB, or other databases
- **Real-time Data**: Integrate WebSockets for live updates
- **File Parsing**: Implement actual Excel/PDF parsing logic

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `src/components/layout/sidebar.tsx`

## 🚀 Future Enhancements

- [ ] Download analyzed results as PDF/Excel
- [ ] Compare multiple files side-by-side
- [ ] Advanced filters and sorting for table data
- [ ] Real AI text summarization integration (OpenAI/Anthropic)
- [ ] User authentication (Google/GitHub login)
- [ ] Upload history and file management
- [ ] Tooltips and hover animations for charts
- [ ] Export dashboard as shareable link
- [ ] Team collaboration features
- [ ] Custom dashboard widgets

## Performance

This dashboard is built with performance in mind:
- Server-side rendering with Next.js App Router
- Optimized bundle size
- Fast refresh during development with Turbopack
- Static generation where possible

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/api)

---

Built with ❤️ using Next.js and TypeScript
