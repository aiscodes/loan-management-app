import { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserById } from '../../../lib/users'
import logger from '../../../utils/logger'

// Fetch a user by ID
const handleGetRequest = async (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query

  try {
    const user = await getUserById(id as string)

    if (user) {
      return res.status(200).json(user)
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error: any) {
    logger.error('Error fetching user by ID', { message: error.message })
    return res.status(500).json({ message: 'Failed to fetch user' })
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGetRequest(req, res)

      default:
        res.setHeader('Allow', ['GET'])
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error: any) {
    logger.error('Unexpected API Error', { message: error.message })
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
