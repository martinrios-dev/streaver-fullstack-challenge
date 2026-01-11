import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam, 10)


    // Validate id is a number
    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: 'Invalid post ID. Must be a number.' },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found.' },
        { status: 404 }
      )
    }

    // Delete the post
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Post deleted successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post. Please try again later.' },
      { status: 500 }
    )
  }
}
