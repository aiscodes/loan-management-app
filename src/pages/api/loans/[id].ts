import { VercelRequest, VercelResponse } from '@vercel/node'
import logger from '../../../utils/logger'
import { getLoanById } from '../../../lib/loans'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  try {
    if (req.method === 'GET') {
      const loan = await getLoanById(id as string)
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' })
      }
      return res.status(200).json(loan)
    } else {
      res.setHeader('Allow', ['GET'])
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error: any) {
    logger.error('Error fetching loan by ID', { message: error.message })
    return res.status(500).json({ message: error.message })
  }
}
