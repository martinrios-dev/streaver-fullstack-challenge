import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Fetch users from JSONPlaceholder
    console.log('  → Fetching users from JSONPlaceholder...')
    const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}`)
    }
    const users = await usersResponse.json()

    // Fetch posts from JSONPlaceholder
    console.log('  → Fetching posts from JSONPlaceholder...')
    const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts')
    if (!postsResponse.ok) {
      throw new Error(`Failed to fetch posts: ${postsResponse.status} ${postsResponse.statusText}`)
    }
    const posts = await postsResponse.json()

    // Seed users with upsert (idempotent)
    console.log('  → Seeding users...')
    for (const u of users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          name: u.name,
          username: u.username,
          email: u.email,
        },
        create: {
          id: u.id,
          name: u.name,
          username: u.username,
          email: u.email,
        },
      })
    }
    console.log(`  ✓ Seeded ${users.length} users`)

    // Seed posts with upsert (idempotent)
    console.log('  → Seeding posts...')
    for (const p of posts) {
      await prisma.post.upsert({
        where: { id: p.id },
        update: {
          userId: p.userId,
          title: p.title,
          body: p.body,
        },
        create: {
          id: p.id,
          userId: p.userId,
          title: p.title,
          body: p.body,
        },
      })
    }
    console.log(`  ✓ Seeded ${posts.length} posts`)

    console.log('🌱 Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding error:', error instanceof Error ? error.message : error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
