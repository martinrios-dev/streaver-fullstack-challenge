import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userIdParam = searchParams.get('userId')

    // Build where clause for optional userId filter
    const where = userIdParam
      ? { userId: parseInt(userIdParam, 10) }
      : {}

    // Fetch posts with user data
    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: 'desc', // Show most recent posts first
      },
    })

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts. Please try again later.' },
      { status: 500 }
    )
  }
}
