import { prisma } from '@/lib/prisma'

export async function syncUser(user: { id: string; email?: string | null }) {
  if (!user.email) return
  const email = user.email.toLowerCase()

  await prisma.user.upsert({
    where: { email },
    update: { id: user.id },
    create: { id: user.id, email },
  })
}