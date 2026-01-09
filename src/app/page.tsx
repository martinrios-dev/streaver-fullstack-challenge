import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
          Streaver Full-Stack Challenge
        </h1>

        <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
          A modern posts management system built with Next.js, TypeScript, Prisma, and SQLite.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          {['nextjs', 'typescript', 'prisma', 'sqlite'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-slate-900 text-slate-400 rounded-full text-sm font-medium border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href="/posts"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          View Posts <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}
