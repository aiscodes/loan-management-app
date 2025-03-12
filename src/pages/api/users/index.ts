import { VercelRequest, VercelResponse } from '@vercel/node'
import prisma from '../../../lib/prisma'
import logger from '../../../utils/logger'

// Получить всех пользователей
const handleGetRequest = async (res: VercelResponse) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
    return res.status(200).json(users)
  } catch (error: any) {
    logger.error('Error fetching users', { message: error.message })
    return res.status(500).json({ message: 'Failed to fetch users' })
  }
}

// Создать пользователя
const handlePostRequest = async (req: VercelRequest, res: VercelResponse) => {
  const { name, email, isBorrower, isLender } = req.body

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' })
  }

  try {
    const newUser = await prisma.user.create({
      data: { name, email, isBorrower: !!isBorrower, isLender: !!isLender }
    })

    return res.status(201).json(newUser)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' })
    }
    logger.error('Error creating user', { message: error.message })
    return res.status(500).json({ message: 'Failed to create user' })
  }
}

// Обработчик запросов
export default async (req: VercelRequest, res: VercelResponse) => {
  switch (req.method) {
    case 'GET':
      return await handleGetRequest(res)
    case 'POST':
      return await handlePostRequest(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` })
  }
}
