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
