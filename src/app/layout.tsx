import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Streaver Full-Stack Challenge',
  description: 'A modern full-stack application with Next.js, TypeScript, Prisma, and SQLite',
}
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen`}>
        <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="text-lg font-bold text-white hover:text-primary transition-colors"
                >
                  Blog Posts
                </Link>
              </div>
              <div className="flex gap-8">
                <Link
                  href="/posts"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Posts
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-12">{children}</main>
      </body>
    </html>
  )
}
