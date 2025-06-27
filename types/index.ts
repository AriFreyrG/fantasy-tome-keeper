// Database types
export interface Book {
  id: string
  title: string
  author: string
  series?: string
  seriesOrder?: number
  isbn?: string
  description?: string
  coverUrl?: string
  pageCount?: number
  publishedDate?: string
  genres: string[]
  status: 'want-to-read' | 'reading' | 'completed' | 'dnf'
  rating?: number
  dateAdded: string
  dateStarted?: string
  dateCompleted?: string
  currentPage?: number
  userId: string
}

export interface AudioBook {
  id: string
  bookId: string
  title: string
  author: string
  narrator?: string
  duration?: number // in seconds
  audioSource: AudioSource
  userId: string
}

export interface AudioSource {
  type: 'local' | 'url' | 'youtube' | 'cloud'
  url: string
  fileName?: string
  fileSize?: number
  cloudProvider?: 'google-drive' | 'dropbox' | 'onedrive'
}

export interface Note {
  id: string
  bookId: string
  title: string
  content: string
  chapter?: string
  pageNumber?: number
  audioTimestamp?: number
  tags: string[]
  type: 'general' | 'character' | 'world-building' | 'plot' | 'quote'
  spoilerLevel: 'none' | 'minor' | 'major'
  dateCreated: string
  dateModified: string
  userId: string
}

export interface Character {
  id: string
  bookId: string
  name: string
  description: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  firstAppearance?: string
  relationships: string[]
  userId: string
}

export interface ReadingSession {
  id: string
  bookId: string
  startTime: string
  endTime: string
  pagesRead: number
  startPage: number
  endPage: number
  audioTimeListened?: number
  notes?: string
  userId: string
}

// API Response types
export interface BookSearchResult {
  id: string
  title: string
  authors: string[]
  description?: string
  pageCount?: number
  publishedDate?: string
  imageLinks?: {
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
  }
  industryIdentifiers?: Array<{
    type: string
    identifier: string
  }>
  categories?: string[]
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  isLoading: boolean
  error?: string
}

// Component Props types
export interface BookCardProps {
  book: Book
  showProgress?: boolean
  onEdit?: (book: Book) => void
  onDelete?: (bookId: string) => void
  onClick?: (book: Book) => void
}

export interface AudioPlayerProps {
  audioBook: AudioBook
  autoPlay?: boolean
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
}

export interface NoteEditorProps {
  note?: Note
  bookId: string
  onSave: (note: Partial<Note>) => void
  onCancel: () => void
}

// Form types
export interface AddBookForm {
  title: string
  author: string
  series?: string
  seriesOrder?: number
  isbn?: string
  description?: string
  pageCount?: number
  publishedDate?: string
  genres: string[]
  status: Book['status']
}

export interface AddAudioBookForm {
  bookId: string
  audioSource: AudioSource
  narrator?: string
  duration?: number
}

// User preferences
export interface UserPreferences {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'auto'
  defaultView: 'grid' | 'list' | 'shelf'
  autoPlay: boolean
  playbackRate: number
  showSpoilers: boolean
  readingGoal?: number
  notifications: {
    readingReminders: boolean
    newReleases: boolean
    readingGoalProgress: boolean
  }
}

// App state types
export interface AppState {
  user: any // Supabase user type
  books: Book[]
  audioBooks: AudioBook[]
  notes: Note[]
  currentlyPlaying?: AudioBook
  preferences: UserPreferences
  isLoading: boolean
  error?: string
}

// Database types for user management
export interface UserProfile {
  id: string
  display_name?: string
  avatar_url?: string
  reading_goal: number
  theme_preference: 'light' | 'dark' | 'auto'
  default_view: 'grid' | 'list' | 'shelf'
  show_spoilers: boolean
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseBook extends Book {
  user_id: string
}

export interface DatabaseNote extends Note {
  user_id: string
}

export interface DatabaseCharacter extends Character {
  user_id: string
}

export interface ReadingList {
  id: string
  user_id: string
  name: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ReadingListBook {
  id: string
  list_id: string
  book_id: string
  added_at: string
  notes?: string
}

export interface BookReview {
  id: string
  user_id: string
  book_id: string
  rating: number
  review_text?: string
  spoiler_level: 'none' | 'minor' | 'major'
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface UserFollow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface ReadingActivity {
  id: string
  user_id: string
  activity_type: 'started_book' | 'finished_book' | 'added_review' | 'created_list'
  book_id?: string
  list_id?: string
  review_id?: string
  activity_data?: any
  created_at: string
}

// Authentication types
export interface AuthUser {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Session {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at: number
}

// API Response types for authentication
export interface AuthResponse {
  user: AuthUser | null
  session: Session | null
  error?: string
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword?: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}
