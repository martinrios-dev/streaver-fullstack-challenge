interface PostCardProps {
  id: number
  title: string
  body: string
  userId: number
  user?: {
    name: string
    username: string
    email: string
  }
  onDelete?: (id: number) => void
}

export default function PostCard({ id, title, body, userId, user, onDelete }: PostCardProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id)
    }
  }

  return (
    <article className="group h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all duration-200 hover:bg-slate-800 hover:border-primary shadow-none hover:shadow-lg hover:shadow-primary/10">
      {/* Header with title and delete button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-100 flex-1 leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-primary">
          {title}
        </h2>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!onDelete}
          aria-label={`Delete post ${id}`}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-red-400 opacity-60 group-hover:opacity-100 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:opacity-30 disabled:hover:text-red-400 disabled:hover:bg-transparent disabled:hover:border-transparent"
        >
          Delete
        </button>
      </div>

      {/* Post body */}
      <p className="text-slate-400 mb-6 leading-relaxed whitespace-pre-line line-clamp-3 text-sm">
        {body}
      </p>

      {/* Footer with metadata */}
      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-800 group-hover:border-slate-700 transition-colors duration-200">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">@{user.username}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{user.name}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-slate-600 transition-colors">
            User ID: {userId}
          </span>
          <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Post ID: {id}</span>
        </div>
      </div>
    </article>
  )
}
