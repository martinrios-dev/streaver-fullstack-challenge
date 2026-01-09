'use client'

import { useState, useEffect } from 'react'
import PostCard from '../../components/PostCard'
import ConfirmDialog from '../../components/ConfirmDialog'

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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userIdFilter, setUserIdFilter] = useState('')
  const [appliedFilter, setAppliedFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Fetch posts from API
  const fetchPosts = async (userId?: string) => {
    setLoading(true)
    setError(null)
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleApplyFilter = () => {
    setAppliedFilter(userIdFilter)
    fetchPosts(userIdFilter)
  }

  const handleClearFilter = () => {
    setUserIdFilter('')
    setAppliedFilter('')
    fetchPosts()
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

    try {
      const response = await fetch(`/api/posts/${postToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete post')
      }

      // Remove post from local state
      setPosts((prev) => prev.filter((post) => post.id !== postToDelete))
      
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (err) {
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

      {/* Loading State */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-6 text-center">
          <div className="inline-flex items-center text-slate-300">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3"></div>
            Loading posts...
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">No posts found.</p>
        </div>
      )}

      {/* Posts List */}
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              userId={post.userId}
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
