'use client'

import { useState, useEffect, useCallback } from 'react'
import PostCard from '../../components/posts/PostCard'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

type Post = {
  id: number
  userId: number
  title: string
  body: string
  user: {
    id: number
    name: string
    username: string
    email: string
  }
}

type CacheData = {
  data: Post[]
  timestamp: number
  userId?: string
}

const CACHE_KEY = 'posts_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Skeleton PostCard component
function PostCardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="h-6 bg-slate-800 rounded w-3/4"></div>
        <div className="h-8 w-16 bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        <div className="h-4 bg-slate-800 rounded w-4/6"></div>
      </div>
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-800">
        <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
        <div className="h-4 w-12 bg-slate-800 rounded"></div>
      </div>
    </div>
  )
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [staleWarning, setStaleWarning] = useState(false)
  const [refreshFailed, setRefreshFailed] = useState(false)
  const [userIdFilter, setUserIdFilter] = useState('')
  const [appliedFilter, setAppliedFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Check if cache is expired
  const isCacheExpired = (timestamp: number): boolean => {
    return Date.now() - timestamp > CACHE_DURATION
  }

  // Load from cache
  const loadFromCache = (userId?: string): { data: Post[]; isStale: boolean } | null => {
    // Only access localStorage on the client
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const cacheData: CacheData = JSON.parse(cached)
      
      // Check if cache matches current filter
      if (cacheData.userId !== userId) return null

      const isStale = isCacheExpired(cacheData.timestamp)
      return { data: cacheData.data, isStale }
    } catch {
      return null
    }
  }

  // Save to cache
  const saveToCache = (data: Post[], userId?: string) => {
    // Only access localStorage on the client
    if (typeof window === 'undefined') return
    
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        userId,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch {
      // Ignore cache errors
    }
  }

  // Fetch posts from API
  const fetchPosts = useCallback(async (userId?: string, isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setLoading(true)
      setError(null)
    }

    try {
      const url = userId
        ? `/api/posts?userId=${encodeURIComponent(userId)}`
        : '/api/posts'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const data = await response.json()
      setPosts(data)
      saveToCache(data, userId)
      
      // Clear warnings on successful refresh
      setStaleWarning(false)
      setRefreshFailed(false)
    } catch (err) {
      if (isBackgroundRefresh) {
        // Background refresh failed, show warning but keep cached data
        setRefreshFailed(true)
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false)
      }
    }
  }, [])

  // Initial fetch with cache
  useEffect(() => {
    const cached = loadFromCache()
    
    if (cached && cached.data.length > 0) {
      // Show cached data immediately
      setPosts(cached.data)
      setLoading(false)
      
      // If cache is stale, show warning and revalidate
      if (cached.isStale) {
        setStaleWarning(true)
      }
      
      // Always revalidate in background
      fetchPosts(undefined, true)
    } else {
      // No cache, normal fetch
      fetchPosts()
    }
  }, [fetchPosts])

  const handleApplyFilter = () => {
    // If filter is empty, behave like Clear
    if (!userIdFilter.trim()) {
      handleClearFilter()
      return
    }
    
    setAppliedFilter(userIdFilter)
    
    // Try to load from cache first
    const cached = loadFromCache(userIdFilter)
    if (cached && cached.data.length > 0) {
      setPosts(cached.data)
      setLoading(false)
      
      if (cached.isStale) {
        setStaleWarning(true)
      }
      
      fetchPosts(userIdFilter, true)
    } else {
      fetchPosts(userIdFilter)
    }
  }

  const handleClearFilter = () => {
    setUserIdFilter('')
    setAppliedFilter('')
    
    const cached = loadFromCache()
    if (cached && cached.data.length > 0) {
      setPosts(cached.data)
      setLoading(false)
      
      if (cached.isStale) {
        setStaleWarning(true)
      }
      
      fetchPosts(undefined, true)
    } else {
      fetchPosts()
    }
  }

  const handleDeleteClick = (id: number) => {
    setPostToDelete(id)
    setDeleteDialogOpen(true)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    setDeleteError(null)

    // Compute next posts state before any async operations
    const postToRemove = posts.find((p) => p.id === postToDelete)
    const nextPosts = posts.filter((post) => post.id !== postToDelete)
    
    // Optimistic delete: remove from UI immediately
    setPosts(nextPosts)

    try {
      const response = await fetch(`/api/posts/${postToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete post')
      }

      // Success: update cache with consistent nextPosts and close dialog
      saveToCache(nextPosts, appliedFilter || undefined)
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (err) {
      // Restore post on error
      if (postToRemove) {
        setPosts((prev) => {
          // Insert back in correct position (sorted by id desc)
          const restored = [...prev, postToRemove]
          restored.sort((a, b) => b.id - a.id)
          return restored
        })
      }
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setPostToDelete(null)
    setDeleteError(null)
  }

  const handleRetry = () => {
    fetchPosts(appliedFilter)
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white mb-2">Posts</h1>
        <p className="text-slate-300 mb-6">Browse and manage posts from all users</p>
        
        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-xs font-medium border border-slate-800">
            #nextjs
          </span>
          <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-xs font-medium border border-slate-800">
            #typescript
          </span>
          <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-xs font-medium border border-slate-800">
            #prisma
          </span>
          <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-xs font-medium border border-slate-800">
            #sqlite
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label
                htmlFor="userId-filter"
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                Filter by User ID
              </label>
              <input
                id="userId-filter"
                type="number"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleApplyFilter}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleClearFilter}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-transparent text-slate-300 font-medium border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

      {/* Stale Data Warning */}
      {staleWarning && !refreshFailed && (
        <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-blue-300 flex-1">
              <strong>Info:</strong> Showing cached data. Refreshing in the background.
            </p>
          </div>
        </div>
      )}

      {/* Refresh Failed Warning */}
      {refreshFailed && (
        <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-yellow-300 flex-1">
              <strong>Notice:</strong> Could not refresh posts. Showing cached data.
            </p>
            <button
              onClick={() => fetchPosts(appliedFilter || undefined)}
              className="px-3 py-1 text-xs font-medium text-yellow-300 hover:text-yellow-200 border border-yellow-800 hover:border-yellow-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-red-300 flex-1">
              <strong>Error:</strong> {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-3 py-1 text-xs font-medium text-red-300 hover:text-red-200 border border-red-800 hover:border-red-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading && posts.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">No posts found.</p>
        </div>
      )}

      {/* Posts List */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              userId={post.userId}
              user={post.user}
              title={post.title}
              body={post.body}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Post"
        description={
          deleteError
            ? deleteError
            : 'Are you sure you want to delete this post? This action cannot be undone.'
        }
        confirmText={deleteError ? 'Close' : 'Delete'}
        cancelText={deleteError ? undefined : 'Cancel'}
        onConfirm={deleteError ? handleCancelDelete : handleConfirmDelete}
        onCancel={deleteError ? undefined : handleCancelDelete}
        loading={isDeleting}
      />
    </div>
  )
}
