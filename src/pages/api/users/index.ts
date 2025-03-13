import { VercelRequest, VercelResponse } from '@vercel/node'
import { createUser, getUsers } from '../../../lib/users'
import logger from '../../../utils/logger'

const handleGetRequest = async (res: VercelResponse) => {
  try {
    const result = await getUsers()
    if (result.success) {
      return res.status(200).json(result.data)
    } else {
      return res.status(500).json({ message: result.error })
    }
  } catch (error: any) {
    logger.error('Error fetching users', { message: error.message })
    return res.status(500).json({ message: 'Failed to fetch users' })
  }
}

const handlePostRequest = async (req: VercelRequest, res: VercelResponse) => {
  const { name, email, isBorrower, isLender, loanData } = req.body

  try {
    const result = await createUser({
      name,
      email,
      isBorrower,
      isLender,
      loanData
    })

    if (result.success) {
      return res.status(201).json(result.data)
    } else {
      return res.status(400).json({ message: result.error })
    }
  } catch (error: any) {
    logger.error('Error creating user', { message: error.message })
    return res.status(500).json({ message: 'Failed to create user' })
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
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
  } catch (error: any) {
    logger.error('Unexpected API Error', { message: error.message })
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
