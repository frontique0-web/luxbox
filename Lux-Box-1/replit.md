# Lux Box - High-End E-Commerce Experience

## Overview

Lux Box is a luxury e-commerce web application designed as a "digital twin" of a physical high-end retail store. The platform sells premium perfumes, watches, accessories, makeup, bags, and mobile covers with a focus on Arabic-speaking customers in Syria. The design philosophy emphasizes ultra-luxury aesthetics with architectural UI elements (arches, vertical slats, linear lighting) inspired by the physical store interior.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state, React Context for cart state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (new-york style)
- **Animations**: Framer Motion for UI animations, Lenis for smooth scrolling
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all database table definitions

### Data Models
The application has four main entities:
1. **Users** - Basic authentication (id, username, password)
2. **Categories** - Product categories with Arabic/English names, icons, slugs
3. **Subcategories** - Nested under categories with display ordering
4. **Products** - Full product details including prices, images, badges, stock status

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components (home sections, cart, layout)
│   │   ├── context/      # React context providers (CartContext)
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # API functions, utilities
│   │   └── pages/        # Page components
├── server/           # Express backend
│   ├── db.ts         # Database connection
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── static.ts     # Static file serving
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle schema definitions
└── scripts/          # Utility scripts (seeding)
```

### Key Design Patterns
- **Storage Interface Pattern**: `IStorage` interface in `storage.ts` abstracts database operations
- **Shared Schema**: Database schema and TypeScript types are shared between frontend and backend
- **API Client Layer**: Centralized API functions in `client/src/lib/api.ts`

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with automatic schema migrations
- **drizzle-kit**: Database migration tool (`npm run db:push`)

### Third-Party Services
- **WhatsApp Integration**: Checkout redirects to WhatsApp with pre-formatted order messages (phone: +963 965 270 528)
- **Google Fonts**: Tajawal, Almarai (Arabic), Montserrat, Playfair Display (English)

### UI Component Libraries
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **TSX**: TypeScript execution for development server