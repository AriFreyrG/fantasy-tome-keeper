import { createClient } from './supabase/client'
import type { Book, Note } from '@/types'

// Book service for client-side operations
export const bookService = {
  // Get all books for a user
  async getUserBooks(userId: string): Promise<{ data: Book[] | null; error: any }> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform database format to app format
    const books: Book[] = data.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      series: book.series,
      seriesOrder: book.series_order,
      isbn: book.isbn,
      description: book.description,
      coverUrl: book.cover_url,
      pageCount: book.page_count,
      publishedDate: book.published_date,
      genres: book.genres ?? [],
      status: book.status,
      rating: book.rating,
      currentPage: book.current_page ?? 0,
      dateAdded: book.date_added,
      dateStarted: book.date_started,
      dateCompleted: book.date_completed,
      userId: book.user_id
    }))
    
    return { data: books, error: null }
  },

  // Add a new book
  async addBook(userId: string, book: Partial<Book>): Promise<{ data: Book | null; error: any }> {
    const supabase = createClient()
    
    const bookData = {
      user_id: userId,
      title: book.title!,
      author: book.author!,
      series: book.series,
      series_order: book.seriesOrder,
      isbn: book.isbn,
      description: book.description,
      cover_url: book.coverUrl,
      page_count: book.pageCount,
      published_date: book.publishedDate,
      genres: book.genres ?? [],
      status: book.status ?? 'want-to-read',
      rating: book.rating,
      current_page: book.currentPage ?? 0,
      date_added: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('user_books')
      .insert(bookData)
      .select()
      .single()
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform back to app format
    const transformedBook: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      series: data.series,
      seriesOrder: data.series_order,
      isbn: data.isbn,
      description: data.description,
      coverUrl: data.cover_url,
      pageCount: data.page_count,
      publishedDate: data.published_date,
      genres: data.genres ?? [],
      status: data.status,
      rating: data.rating,
      currentPage: data.current_page ?? 0,
      dateAdded: data.date_added,
      dateStarted: data.date_started,
      dateCompleted: data.date_completed,
      userId: data.user_id
    }
    
    return { data: transformedBook, error: null }
  },

  // Update a book (simplified to reduce complexity)
  async updateBook(bookId: string, updates: Partial<Book>): Promise<{ data: Book | null; error: any }> {
    const supabase = createClient()
    
    // Create update object with database field names
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }
    
    const fieldMapping = {
      title: 'title',
      author: 'author',
      series: 'series',
      seriesOrder: 'series_order',
      isbn: 'isbn',
      description: 'description',
      coverUrl: 'cover_url',
      pageCount: 'page_count',
      publishedDate: 'published_date',
      genres: 'genres',
      status: 'status',
      rating: 'rating',
      currentPage: 'current_page',
      dateStarted: 'date_started',
      dateCompleted: 'date_completed'
    }
    
    // Map updates to database fields
    Object.entries(updates).forEach(([key, value]) => {
      const dbField = fieldMapping[key as keyof typeof fieldMapping]
      if (dbField && value !== undefined) {
        updateData[dbField] = value
      }
    })
    
    const { data, error } = await supabase
      .from('user_books')
      .update(updateData)
      .eq('id', bookId)
      .select()
      .single()
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform back to app format
    const transformedBook: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      series: data.series,
      seriesOrder: data.series_order,
      isbn: data.isbn,
      description: data.description,
      coverUrl: data.cover_url,
      pageCount: data.page_count,
      publishedDate: data.published_date,
      genres: data.genres ?? [],
      status: data.status,
      rating: data.rating,
      currentPage: data.current_page ?? 0,
      dateAdded: data.date_added,
      dateStarted: data.date_started,
      dateCompleted: data.date_completed,
      userId: data.user_id
    }
    
    return { data: transformedBook, error: null }
  },

  // Delete a book
  async deleteBook(bookId: string): Promise<{ error: any }> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('id', bookId)
    
    return { error }
  },

  // Get book statistics for a user
  async getBookStats(userId: string): Promise<{ 
    data: { 
      total: number
      reading: number
      completed: number
      wantToRead: number
    } | null
    error: any 
  }> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_books')
      .select('status')
      .eq('user_id', userId)
    
    if (error) {
      return { data: null, error }
    }
    
    const stats = {
      total: data.length,
      reading: data.filter(book => book.status === 'reading').length,
      completed: data.filter(book => book.status === 'completed').length,
      wantToRead: data.filter(book => book.status === 'want-to-read').length
    }
    
    return { data: stats, error: null }
  }
}

// Note service for client-side operations
export const noteService = {
  // Get notes for a book
  async getBookNotes(bookId: string): Promise<{ data: Note[] | null; error: any }> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('book_notes')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform database format to app format
    const notes: Note[] = data.map(note => ({
      id: note.id,
      bookId: note.book_id,
      title: note.title,
      content: note.content,
      chapter: note.chapter,
      pageNumber: note.page_number,
      audioTimestamp: note.audio_timestamp,
      tags: note.tags ?? [],
      type: note.type ?? 'general',
      spoilerLevel: note.spoiler_level ?? 'none',
      dateCreated: note.created_at,
      dateModified: note.updated_at,
      userId: note.user_id
    }))
    
    return { data: notes, error: null }
  },

  // Get all notes for a user
  async getUserNotes(userId: string): Promise<{ data: Note[] | null; error: any }> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('book_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform database format to app format
    const notes: Note[] = data.map(note => ({
      id: note.id,
      bookId: note.book_id,
      title: note.title,
      content: note.content,
      chapter: note.chapter,
      pageNumber: note.page_number,
      audioTimestamp: note.audio_timestamp,
      tags: note.tags ?? [],
      type: note.type ?? 'general',
      spoilerLevel: note.spoiler_level ?? 'none',
      dateCreated: note.created_at,
      dateModified: note.updated_at,
      userId: note.user_id
    }))
    
    return { data: notes, error: null }
  },

  // Add a new note
  async addNote(userId: string, note: Partial<Note>): Promise<{ data: Note | null; error: any }> {
    const supabase = createClient()
    
    const noteData = {
      user_id: userId,
      book_id: note.bookId!,
      title: note.title!,
      content: note.content!,
      chapter: note.chapter,
      page_number: note.pageNumber,
      audio_timestamp: note.audioTimestamp,
      tags: note.tags ?? [],
      type: note.type ?? 'general',
      spoiler_level: note.spoilerLevel ?? 'none',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('book_notes')
      .insert(noteData)
      .select()
      .single()
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform back to app format
    const transformedNote: Note = {
      id: data.id,
      bookId: data.book_id,
      title: data.title,
      content: data.content,
      chapter: data.chapter,
      pageNumber: data.page_number,
      audioTimestamp: data.audio_timestamp,
      tags: data.tags ?? [],
      type: data.type ?? 'general',
      spoilerLevel: data.spoiler_level ?? 'none',
      dateCreated: data.created_at,
      dateModified: data.updated_at,
      userId: data.user_id
    }
    
    return { data: transformedNote, error: null }
  },

  // Update a note
  async updateNote(noteId: string, updates: Partial<Note>): Promise<{ data: Note | null; error: any }> {
    const supabase = createClient()
    
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }
    
    const fieldMapping = {
      title: 'title',
      content: 'content',
      chapter: 'chapter',
      pageNumber: 'page_number',
      audioTimestamp: 'audio_timestamp',
      tags: 'tags',
      type: 'type',
      spoilerLevel: 'spoiler_level'
    }
    
    // Map updates to database fields
    Object.entries(updates).forEach(([key, value]) => {
      const dbField = fieldMapping[key as keyof typeof fieldMapping]
      if (dbField && value !== undefined) {
        updateData[dbField] = value
      }
    })
    
    const { data, error } = await supabase
      .from('book_notes')
      .update(updateData)
      .eq('id', noteId)
      .select()
      .single()
    
    if (error) {
      return { data: null, error }
    }
    
    // Transform back to app format
    const transformedNote: Note = {
      id: data.id,
      bookId: data.book_id,
      title: data.title,
      content: data.content,
      chapter: data.chapter,
      pageNumber: data.page_number,
      audioTimestamp: data.audio_timestamp,
      tags: data.tags ?? [],
      type: data.type ?? 'general',
      spoilerLevel: data.spoiler_level ?? 'none',
      dateCreated: data.created_at,
      dateModified: data.updated_at,
      userId: data.user_id
    }
    
    return { data: transformedNote, error: null }
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<{ error: any }> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('book_notes')
      .delete()
      .eq('id', noteId)
    
    return { error }
  }
}
