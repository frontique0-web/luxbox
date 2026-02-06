# Lux Box - High-End E-Commerce Experience

## Overview

Lux Box is a luxury e-commerce web application designed as a "digital twin" of a physical high-end retail store located in Aleppo, Syria. The platform sells premium perfumes, watches, accessories, makeup, bags, mobile covers, and vape products. The site is bilingual (Arabic/English) with a strong Arabic-first design, featuring an immersive luxury aesthetic inspired by the physical store's interior design elements (arches, vertical slats, linear lighting). Checkout is handled via WhatsApp — there is no payment gateway integration. The app is a single-page storefront with a catalog, cart sidebar, and contact section.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router). Currently only has a home page and 404 page.
- **State Management**: TanStack React Query for server state (categories, products, etc.), React Context for cart state (`CartContext`). Cart persists to localStorage.
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (new-york style). Custom CSS variables define a luxury color palette (dark green `#0B281F`, gold `#D4AF37`, white/off-white backgrounds). Three font families via Google Fonts: Almarai/Tajawal (Arabic), Montserrat (sans-serif English), Playfair Display (serif English).
- **Animations**: Framer Motion for UI animations and transitions. Lenis for smooth scrolling.
- **Build Tool**: Vite with custom plugins for Replit integration (runtime error overlay, cartographer, dev banner, meta images).
- **Component Library**: Extensive shadcn/ui components installed in `client/src/components/ui/`.

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **API Design**: RESTful endpoints under `/api/*` prefix. Key endpoints:
  - `GET /api/categories` — all product categories
  - `GET /api/categories/:categoryId/subcategories` — subcategories for a category
  - `GET /api/subcategories/:subcategoryId/brands` — brands within a subcategory
  - `GET /api/products` — products with optional query filters (`categoryId`, `subcategoryId`, `brandId`)
- **Development**: Vite dev server middleware is used in development mode (via `server/vite.ts`). In production, static files are served from `dist/public` (via `server/static.ts`).
- **Build Process**: Custom build script (`script/build.ts`) that runs Vite for the client and esbuild for the server, outputting to `dist/`.

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Connection**: Uses `pg` Pool, connecting via `SUPABASE_DATABASE_URL` or `DATABASE_URL` environment variable
- **Schema Location**: `shared/schema.ts` — shared between client and server
- **Schema Push**: `npm run db:push` (uses drizzle-kit)
- **Seeding**: `scripts/seed.ts` populates categories, subcategories, and sample products

### Data Models
Four main entities plus users:
1. **Users** — `id` (UUID), `username`, `password`
2. **Categories** — `id`, `nameAr`, `nameEn`, `icon`, `slug`, `displayOrder`, `createdAt`
3. **Subcategories** — `id`, `categoryId` (FK to categories), `nameAr`, `nameEn`, `displayOrder`, `createdAt`
4. **Brands** — referenced in storage interface, linked to subcategories
5. **Products** — full product details including names, prices, images, badges, stock status, linked to category/subcategory/brand

### Project Structure
```
├── client/                 # React frontend (Vite root)
│   ├── index.html          # HTML entry point
│   ├── public/             # Static assets (images, favicon)
│   └── src/
│       ├── components/
│       │   ├── cart/        # CartSidebar (WhatsApp checkout)
│       │   ├── home/        # Page sections (Hero, About, Catalog, Features, Contact, VapeCatalog)
│       │   ├── layout/      # Navbar, Footer
│       │   └── ui/          # shadcn/ui components
│       ├── context/         # CartContext (React context for cart state)
│       ├── hooks/           # Custom hooks (use-mobile, use-toast)
│       ├── lib/             # API functions, queryClient, utilities
│       └── pages/           # Page components (home, not-found)
├── server/                 # Express backend
│   ├── index.ts            # Server entry, middleware setup
│   ├── db.ts               # PostgreSQL connection via Drizzle
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database access layer (IStorage interface + DatabaseStorage)
│   ├── static.ts           # Production static file serving
│   └── vite.ts             # Development Vite middleware
├── shared/                 # Shared between client and server
│   └── schema.ts           # Drizzle table definitions and Zod schemas
├── scripts/                # Utility scripts
│   └── seed.ts             # Database seeding
├── script/                 # Build scripts
│   └── build.ts            # Custom build (Vite + esbuild)
├── migrations/             # Drizzle migration output directory
└── attached_assets/        # Design specification documents
```

### Key Design Decisions
- **Storage Interface Pattern**: `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation, allowing easy swapping of data sources.
- **Shared Schema**: Database schema in `shared/schema.ts` is imported by both client (for TypeScript types) and server (for queries), ensuring type safety across the stack.
- **WhatsApp Checkout**: No payment processing — cart contents are formatted into a WhatsApp message and sent to the store's number (`963965270528`).
- **Single Page App**: The entire storefront is a single-page scroll experience with section-based navigation (Hero → About → Catalog → Features → Contact).

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` or `SUPABASE_DATABASE_URL` environment variable
- **Drizzle ORM** — SQL query builder and schema management
- **drizzle-kit** — Database migration and schema push tool

### Third-Party Services
- **WhatsApp Business API** — Used for checkout (via `wa.me` links, no API key needed)
- **Google Fonts** — Almarai, Tajawal, Montserrat, Playfair Display font families loaded via CDN
- **Supabase** — Database hosting (indicated by `SUPABASE_DATABASE_URL` env var support)

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, Lenis, shadcn/ui (Radix UI primitives), Tailwind CSS v4, embla-carousel-react, react-day-picker, recharts, vaul (drawer), cmdk (command palette), react-hook-form + zod
- **Backend**: Express 5, pg (PostgreSQL client), connect-pg-simple (session store), drizzle-orm
- **Build**: Vite, esbuild, tsx (TypeScript execution), @replit/vite-plugin-* (Replit-specific dev tools)

### Social Media Links (hardcoded)
- Instagram: @lux_box_2025
- Facebook: Lux Box
- TikTok: @lux_box_store
- WhatsApp: +963 965 270 528