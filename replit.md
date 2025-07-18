# Budget Buddy - Personal Finance Manager

## Overview

Budget Buddy is a beautiful, modern, and mobile-first personal finance management application built with React and Express. It provides users with comprehensive tools to track expenses, manage budgets, monitor assets, and gain insights into their financial health through AI-powered analysis. The app features a stunning design with purple and blue gradients, smooth animations, and a completely local-first approach to data privacy.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (v1.0)

✓ **Beautiful Design Overhaul** - Added stunning purple/blue gradients with glass morphism effects
✓ **Assets Management** - Complete asset tracking system for net worth monitoring
✓ **Enhanced Navigation** - Improved bottom navigation with smooth animations
✓ **GitHub Pages Deployment** - Free deployment setup with GitHub Actions workflow
✓ **Production Documentation** - Complete README, deployment guide, and LICENSE
✓ **Mobile-First Experience** - Touch-optimized interface with 44px minimum touch targets
✓ **Empty State Design** - Motivational "broke state" system for users with no data

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Form Management**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Mobile-First Design**: Responsive layout with bottom navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful endpoints with JSON responses
- **Validation**: Zod schemas for request/response validation

### Key Components

#### Database Schema
- **Transactions**: Store income and expense records with categories, amounts, and dates
- **Budgets**: Track spending limits per category with period-based budgets
- **Settings**: User preferences including currency, theme, and notifications

#### API Endpoints
- **Transactions**: CRUD operations for financial transactions
- **Budgets**: Budget management with automatic spending tracking
- **Analytics**: Financial insights and spending analysis
- **AI Assistant**: OpenAI-powered financial advice and chat functionality
- **Settings**: User preference management
- **Data Export**: Excel/CSV export functionality

#### Frontend Pages
- **Dashboard**: Overview of financial health with quick stats and AI insights
- **Transactions**: Transaction listing with filtering and search capabilities
- **Budgets**: Budget creation and progress tracking
- **Assets**: Comprehensive asset management for net worth tracking
- **Reports**: Visual analytics and spending breakdowns
- **Settings**: User preferences and data management

### New Features (v1.0)
- **Asset Management**: Track net worth across multiple categories (property, vehicles, electronics, etc.)
- **Multi-Currency Support**: Handle international transactions with automatic USD conversion
- **Enhanced AI Tips**: Personalized financial advice using OpenAI GPT-4
- **"Broke State" Motivation**: Encouraging empty states when no financial data exists
- **Beautiful Design**: Modern gradients, smooth animations, and glass morphism effects

## Data Flow

1. **User Input**: Forms capture transaction and budget data
2. **Client Validation**: Zod schemas validate data before submission
3. **API Processing**: Express routes handle requests with additional validation
4. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
5. **Response Handling**: TanStack Query manages caching and updates
6. **UI Updates**: React components re-render with fresh data

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **UI Framework**: Multiple @radix-ui components for accessible UI
- **AI Integration**: OpenAI API for financial insights and chat
- **Form Management**: @hookform/resolvers for form validation
- **State Management**: @tanstack/react-query for server state

### Development Tools
- **Build Tool**: Vite for fast development and building
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code formatting and linting
- **PostCSS**: CSS processing with Tailwind CSS

## Deployment Strategy

### Development Setup
- **Dev Server**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for instant frontend updates
- **Database**: Development database with push migrations
- **Environment**: Local development with environment variables

### Production Build
- **Frontend**: Vite builds static assets to dist/public
- **Backend**: ESBuild bundles server code to dist/index.js
- **Database**: Migration system with drizzle-kit
- **Deployment**: Single deployment with static frontend serving

### Environment Configuration
- **Database**: DATABASE_URL for PostgreSQL connection
- **AI Service**: OPENAI_API_KEY for AI features
- **Session**: Session management with connect-pg-simple
- **CORS**: Cross-origin resource sharing configuration

## Technical Decisions

### Database Choice
- **PostgreSQL**: Chosen for ACID compliance and complex query support
- **Drizzle ORM**: Type-safe database operations with excellent TypeScript integration
- **Neon**: Serverless PostgreSQL for scalability and cost efficiency

### UI/UX Approach
- **Mobile-First**: Bottom navigation and touch-friendly interface
- **Beautiful Design**: Modern color palette with purple/blue gradients and glass morphism
- **Smooth Animations**: Micro-interactions and transitions for delightful UX
- **Accessibility**: Radix UI components ensure ARIA compliance
- **Performance**: Code splitting and lazy loading for optimal load times

### AI Integration
- **OpenAI GPT-4**: Latest model for accurate financial advice
- **Context-Aware**: AI analyzes user's actual financial data
- **Privacy**: No sensitive data stored in AI service logs
- **Fallback**: Graceful degradation when AI service unavailable

### Design System
- **Color Palette**: Purple primary (#8B5CF6), Blue secondary (#0EA5E9), Modern grays
- **Components**: Glass morphism cards, gradient buttons, enhanced shadows
- **Animations**: Subtle bounce effects, smooth transitions, scale interactions
- **Typography**: Inter font family for modern, readable text