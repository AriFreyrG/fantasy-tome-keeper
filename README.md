# 📚 Fantasy Tome Keeper

A comprehensive Progressive Web App for fantasy book enthusiasts to manage their reading collection, notes, and audiobook experience in one beautiful, unified platform.

## 🌟 Features

### 📖 Virtual Bookshelf
- Beautiful, responsive book collection display
- Multiple view modes: grid, list, and 3D shelf views
- Smart organization by series, author, genre, and reading status
- Reading progress tracking and goals

### 🔍 Smart Book Management
- **Auto-enrichment**: Add books by ISBN, title, or photo scan
- **Automatic metadata**: Fetch cover art, descriptions, author info, series data
- **Multiple sources**: Google Books API, Open Library, and more
- **Manual entry**: Full control for rare or self-published works

### 📝 Advanced Note System
- **Chapter-by-chapter notes**: Organize thoughts by book sections
- **Character tracking**: Keep track of complex fantasy characters
- **World-building notes**: Document magic systems, geography, politics
- **Spoiler protection**: Hide/show notes based on reading progress
- **Rich text editor**: Markdown support for formatted notes

### 🎧 Integrated Audiobook Player
- **Multi-source support**: 
  - Local MP3/M4A files
  - Direct streaming URLs
  - Cloud storage links (Google Drive, Dropbox)
  - YouTube integration (where permitted)
- **Smart playback features**:
  - Variable speed control (0.5x to 3x)
  - Auto-bookmarking with chapter detection
  - Sleep timer functionality
  - Background playback with media controls
  - Sync audio position with reading notes

### � User Authentication & Data Management
- **Secure Authentication**: Email/password signup and login with Supabase
- **User Profiles**: Personal profiles with reading preferences and goals
- **Protected Routes**: Authentication guards ensuring data security
- **Session Management**: Persistent login across browser sessions
- **Data Isolation**: Row Level Security ensuring users only access their own data
### 🔄 Cross-Platform Sync & Data Management
- **Offline-first**: Access your library and notes without internet
- **Real-time sync**: Keep data synchronized across all devices
- **Export capabilities**: Backup your entire library and notes

## 🛠️ Technical Stack

### Frontend
- **Next.js 15+** with App Router for optimal performance
- **React 18** with modern hooks and concurrent features
- **TailwindCSS** for responsive, mobile-first design
- **Framer Motion** for smooth animations and transitions
- **React Query (TanStack Query)** for efficient data fetching
- **TypeScript** for type safety and better development experience

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** with Row Level Security for data protection
- **Real-time subscriptions** for live data updates
- **Server-side rendering** with Next.js API routes

### Authentication & Security
- **Supabase Auth** for secure user authentication
- **JWT tokens** with automatic refresh
- **Row Level Security (RLS)** for database access control
- **Protected routes** with middleware-based authentication
- **Secure environment variable handling**

### PWA Features
- **Service Worker** for offline functionality (ready for implementation)
- **Web App Manifest** for native app-like installation
- **Responsive Design** optimized for all device sizes
- **Modern Web APIs** for enhanced user experience

### Deployment & DevOps
- **Vercel** optimized deployment with automatic builds
- **Docker** containerization for flexible hosting options
- **Environment management** for secure configuration
- **Health monitoring** with built-in API endpoints

### APIs & Integrations
- **Google Books API** for book metadata and covers
- **Open Library API** as fallback book source
- **Web Audio API** for advanced audiobook playback
- **Media Session API** for system media controls
- **File System Access API** for local file management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with PWA support

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fantasy-tome-keeper

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and database URL

# Run development server
npm run dev
```

### Environment Variables
```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Books API (OPTIONAL)
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=your_google_books_api_key

# YouTube API (OPTIONAL, for enhanced integration)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/arifreyrg/fantasy-tome-keeper.git
cd fantasy-tome-keeper

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Set up database (see AUTHENTICATION_SETUP.md for detailed instructions)
# 1. Create Supabase project at supabase.com
# 2. Run SQL schema from database/schema.sql
# 3. Add your credentials to .env.local

# Run development server
npm run dev
```

### Authentication Setup
This app requires Supabase for user authentication and data storage. See [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) for detailed setup instructions.

### Deployment
For production deployment to Vercel or Docker, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 📱 PWA Installation

### Mobile (iOS/Android)
1. Visit the app in your mobile browser
2. Tap "Add to Home Screen" or "Install App"
3. Launch from your home screen like any native app

### Desktop
1. Visit the app in Chrome, Edge, or Safari
2. Click the install icon in the address bar
3. Launch from your applications folder or desktop

## 🎯 Current Status & Next Steps

### ✅ **Recently Completed: Full Authentication & Database System**
- **Complete User Authentication**: Email/password signup, login, session management
- **Supabase Database Integration**: Full schema with RLS policies, user profiles, books, notes
- **Protected Routes**: Middleware-based authentication guards and redirects
- **User Library**: Personal dashboard with book management and statistics
- **Production Ready**: Docker and Vercel deployment configurations included
- **Comprehensive Documentation**: Setup guides and deployment instructions

### ✅ **Previously Completed: Fantasy Wiki Integration**
- **Smart Wiki Search**: Integration with major fantasy wikis (Coppermind, AWOIAF, Tolkien Gateway)
- **Character Panels**: Detailed character information with spoiler protection
- **World-building Context**: Access to locations, magic systems, and lore
- **Reading Progress Integration**: Spoiler-safe content filtering based on current chapter
- **Demo Interface**: Full showcase at `/demo` with live examples

### 🚧 **Next Development Priorities**

#### 1. **Enhanced User Experience** 🎨
**Goal**: Improve the user interface and add core functionality

**Implementation Tasks**:
- [ ] **Book Management UI**:
  - Add book forms with ISBN lookup
  - Edit and delete book functionality
  - Reading progress tracking interface
  - Book cover upload and management
- [ ] **Note-Taking System**:
  - Rich text editor for book notes
  - Chapter-by-chapter organization
  - Character tracking and world-building notes
  - Spoiler level controls
- [ ] **Library Features**:
  - Advanced search and filtering
  - Reading goals and statistics
  - Book import from CSV/other services

**Database Schema (IMPLEMENTED)**:
```sql
-- Users and profiles ✅ COMPLETE
user_profiles (id, display_name, avatar_url, reading_goal, preferences)

-- Books and collections ✅ COMPLETE  
user_books (id, user_id, title, author, status, rating, notes)
reading_sessions (id, user_id, book_id, start_time, pages_read)

-- Notes and annotations ✅ COMPLETE
book_notes (id, user_id, book_id, chapter, content, spoiler_level)
character_notes (id, user_id, book_id, character_name, notes)

-- Audiobooks and media ✅ COMPLETE
audiobooks (id, user_id, book_id, source_type, file_url, position)

-- Social features (READY FOR IMPLEMENTATION)
reading_lists (id, user_id, name, description, is_public)
list_books (list_id, book_id, added_at, notes)
book_reviews (id, user_id, book_id, rating, review, spoiler_level)
user_follows (follower_id, following_id, created_at)
reading_activity (id, user_id, activity_type, book_id, created_at)
```

#### 2. **Social Features & Sharing** 🤝
**Goal**: Enable users to share their reading experiences and discover new books

**Core Sharing Features**:
- [ ] **Reading Lists Sharing**:
  - Public/private reading lists
  - Shareable collection URLs
  - Collaborative reading lists with friends
- [ ] **Reviews & Recommendations**:
  - Star ratings and written reviews
  - Spoiler-free recommendation system
  - "Similar readers liked..." suggestions
- [ ] **Social Reading**:
  - Follow other readers
  - Reading activity feeds
  - Book discussion threads
- [ ] **Wiki Content Contributions**:
  - User-contributed character notes
  - Community-curated reading guides
  - Shared spoiler-free summaries

#### 3. **Audiobook Features** 🎧
**Goal**: Implement the complete audiobook experience

**Implementation Tasks**:
- [ ] **Audio Player Component**: Full-featured player with controls
- [ ] **File Management**: Upload and organize audio files
- [ ] **Playback Features**: Variable speed, bookmarks, sleep timer
- [ ] **Sync Integration**: Link audio position with reading notes

**Sharing Schema Extension (READY FOR IMPLEMENTATION)**:
```sql
-- Social features ✅ SCHEMA READY
user_follows (follower_id, following_id, created_at)
reading_lists (id, user_id, name, description, is_public)
list_books (list_id, book_id, added_at, notes)

-- Reviews and social content ✅ SCHEMA READY
book_reviews (id, user_id, book_id, rating, review, spoiler_level)
reading_activity (id, user_id, activity_type, book_id, created_at)
```

#### 4. **Enhanced Data Sources** 📊
**Goal**: Improve book metadata and expand content sources

**Implementation Tasks**:
- [ ] **Google Books API Integration**: Complete book metadata fetching
- [ ] **Goodreads CSV Import**: Migrate existing collections
- [ ] **Local Audio File Support**: Upload and manage audiobook files
- [ ] **Enhanced Wiki Features**: Character relationship maps, timeline integration

### 🚀 **Development Roadmap**

#### **Phase 1: Foundation** ✅ **COMPLETED**
- [x] ~~Wiki integration and demo~~ ✅ **COMPLETED**
- [x] ~~**Database setup and user authentication**~~ ✅ **COMPLETED**
- [x] ~~**Basic CRUD operations for authenticated users**~~ ✅ **COMPLETED**
- [x] ~~**Production deployment configuration**~~ ✅ **COMPLETED**

#### **Phase 2: Core Features** 🎯 **CURRENT FOCUS**
- [ ] **Enhanced book management UI** 🎯 **NEXT PRIORITY**
- [ ] **Note-taking system with rich text editor**
- [ ] **Audiobook player and file management**
- [ ] **Reading progress tracking and goals**

#### **Phase 3: Sharing & Social** (Following 3-4 weeks)
- [ ] **User profiles and basic social features**
- [ ] **Reading list sharing and collaboration**
- [ ] **Review and recommendation system**
- [ ] **Activity feeds and social discovery**

#### **Phase 4: Enhanced Features** (Future)
- [ ] Advanced audiobook features (cloud sync, advanced player)
- [ ] Mobile app versions (React Native or Capacitor)
- [ ] Advanced analytics and reading insights
- [ ] AI-powered book recommendations

### 📋 **Technical Debt & Improvements**
- [ ] **Error Handling**: Comprehensive error boundaries and user feedback
- [ ] **Performance**: Code splitting and lazy loading for wiki components
- [ ] **Testing**: Unit tests for wiki integration and database operations
- [ ] **Accessibility**: ARIA labels and keyboard navigation improvements
- [ ] **Mobile UX**: Touch gestures and native mobile interactions

### 🎯 **Success Metrics**
- **User Adoption**: 100+ active users with personal libraries
- **Engagement**: Average 3+ books per user with active note-taking
- **Sharing**: 50+ public reading lists and community discussions
- **Wiki Usage**: 80% of users engaging with wiki integration features

---

**Next Development Session Focus**: 
1. ✅ ~~Set up Supabase database schema~~ **COMPLETED**
2. ✅ ~~Implement user authentication system~~ **COMPLETED**  
3. ✅ ~~Create authenticated user interface~~ **COMPLETED**
4. 🎯 **Build enhanced book management UI** **NEXT PRIORITY**
5. 🎯 **Implement note-taking system**

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines
- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure mobile responsiveness for all features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Fantasy reading community for inspiration
- Open source libraries that make this possible
- API providers for book metadata and services

---

**Built with ❤️ for fantasy book lovers everywhere**

## 🧭 Developer Guide: File Locations & Common Tasks

### 📁 **Project Structure Overview**
```
/Users/ari/development/project4/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and services
├── types/                  # TypeScript type definitions
├── public/                 # Static assets (icons, images)
└── Configuration files...
```

### 🎨 **Design & Styling Tasks**

#### **Global Styles & Theme**
- **File**: `app/globals.css`
- **What**: Global CSS variables, utility classes, and custom styles
- **Common tasks**: 
  - Modify color scheme (primary, fantasy-gold colors)
  - Add new utility classes (`.glass`, `.btn-fantasy`)
  - Adjust global font settings and animations

#### **Tailwind Configuration**
- **File**: `tailwind.config.js`
- **What**: Custom colors, fonts, and Tailwind extensions
- **Common tasks**:
  - Add new color variants
  - Configure custom font families
  - Extend spacing, breakpoints, or animations

#### **Component-Level Styling**
- **Location**: Within each component file using Tailwind classes
- **Pattern**: `className="glass rounded-xl p-6 hover:shadow-lg transition-all"`
- **Common tasks**:
  - Modify existing component appearance
  - Add responsive breakpoints (`sm:`, `md:`, `lg:`)
  - Implement hover states and animations

### 🧩 **Adding New UI Components**

#### **Simple Components** (buttons, cards, inputs)
- **Location**: `components/` directory
- **Pattern**: Create `ComponentName.tsx`
- **Example**: 
```tsx
// components/BookCard.tsx
interface BookCardProps {
  readonly title: string
  readonly author: string
}

export function BookCard({ title, author }: BookCardProps) {
  return (
    <div className="book-card p-4">
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  )
}
```

#### **Complex Feature Components** (wiki integration, audio player)
- **Location**: `components/[feature-name]/` subdirectory
- **Example**: `components/wiki/WikiSearch.tsx`
- **Include**: Index file for easy imports (`components/wiki/index.ts`)

#### **Page Components**
- **Location**: `app/[route-name]/page.tsx`
- **Example**: `app/demo/page.tsx` for `/demo` route
- **Pattern**: Default export function with descriptive name

### 🔧 **Business Logic & Data Management**

#### **Custom Hooks** (data fetching, state management)
- **Location**: `hooks/`
- **Example**: `hooks/use-wiki-integration.ts`
- **Common tasks**:
  - API data fetching with React Query
  - Complex state management
  - Shared logic between components

#### **Services & Utilities** (API clients, helpers)
- **Location**: `lib/`
- **Example**: `lib/wiki-integration.ts`
- **Common tasks**:
  - External API integrations
  - Data transformation utilities
  - Business logic that doesn't need React

#### **Type Definitions**
- **Location**: `types/index.ts`
- **Common tasks**:
  - Define interfaces for API responses
  - Component prop types
  - Database schema types

### 📄 **Adding New Pages/Routes**

#### **Simple Page**
1. Create `app/[route-name]/page.tsx`
2. Export default component
3. Add navigation links where needed

#### **Page with Layout**
1. Create `app/[route-name]/layout.tsx` (optional)
2. Create `app/[route-name]/page.tsx`
3. Update navigation in `app/layout.tsx` if needed

### 🎯 **Common Development Tasks**

#### **Adding a New Button**
1. **Styled Button**: Use existing classes
```tsx
<button className="btn-fantasy">
  <PlusIcon className="h-4 w-4 mr-2" />
  Add Book
</button>
```

2. **Custom Button Component**: Create in `components/`
```tsx
// components/ActionButton.tsx
interface ActionButtonProps {
  readonly variant: 'primary' | 'secondary'
  readonly children: React.ReactNode
  readonly onClick: () => void
}
```

#### **Adding Navigation Links**
- **Main Navigation**: Edit `app/page.tsx` header section
- **Mobile Navigation**: Consider responsive design patterns
- **Footer Links**: Add to `app/layout.tsx` if you create a footer

#### **Integrating New API**
1. **Create Service**: `lib/[api-name]-service.ts`
2. **Add Types**: Update `types/index.ts`
3. **Create Hook**: `hooks/use-[feature-name].ts`
4. **Use in Component**: Import hook and handle loading/error states

#### **Adding Form Components**
1. **Simple Forms**: Use native HTML with Tailwind styling
2. **Complex Forms**: Consider `react-hook-form` (already installed)
3. **Validation**: Add client-side validation with error states

### 🗂️ **File Organization Patterns**

#### **Component Files**
```tsx
// Standard component structure
'use client' // if needed for client-side features

import { useState } from 'react'
import { SomeIcon } from 'lucide-react'

interface ComponentProps {
  readonly prop1: string
  readonly prop2?: number
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  )
}
```

#### **Hook Files**
```tsx
// hooks/use-feature-name.ts
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export function useFeatureName(param: string) {
  // Hook logic
  return {
    data,
    isLoading,
    error,
    // actions
  }
}
```

#### **Service Files**
```tsx
// lib/service-name.ts
export interface ServiceResponse {
  // Type definitions
}

export class ServiceName {
  // Service implementation
}

export const serviceInstance = new ServiceName()
```

### 🎛️ **Configuration Files**

#### **Environment Variables**
- **File**: `.env.local`
- **Usage**: API keys, database URLs, feature flags
- **Access**: `process.env.NEXT_PUBLIC_API_KEY`

#### **TypeScript Configuration**
- **File**: `tsconfig.json`
- **Common**: Path aliases (`@/` points to project root)

#### **Next.js Configuration**
- **File**: `next.config.js`
- **Common**: Image domains, redirects, experimental features

### 🛠️ **Development Workflow**

#### **Making Changes**
1. **Start dev server**: `npm run dev`
2. **Edit files**: Changes auto-reload in browser
3. **Check TypeScript**: `npm run type-check`
4. **Lint code**: `npm run lint`

#### **Adding Dependencies**
```bash
# UI/utility libraries
npm install [package-name]

# Type definitions (if needed)
npm install -D @types/[package-name]
```

#### **Testing Changes**
- **Manual testing**: Use browser dev tools and mobile viewport
- **TypeScript errors**: Check VS Code problems panel
- **Console errors**: Monitor browser console

### 📱 **Mobile-First Development**

#### **Responsive Design Pattern**
```tsx
<div className="
  grid grid-cols-1           // Mobile: single column
  md:grid-cols-2            // Tablet: two columns  
  lg:grid-cols-3            // Desktop: three columns
  gap-4 md:gap-6            // Responsive spacing
">
```

#### **Touch-Friendly Components**
- **Minimum touch target**: `min-h-[44px] min-w-[44px]`
- **Hover states**: Use `hover:` classes for desktop
- **Focus states**: Always include `focus:` classes for accessibility
