import { VercelRequest, VercelResponse } from '@vercel/node'
import logger from '../../../utils/logger'
import { createLoan, getAllLoans } from '../../../lib/loans'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const loans = await getAllLoans()
        return res.status(200).json(loans)

      case 'POST':
        const { amount, interest, duration, collateral, borrowerId, lenderId } =
          req.body
        const loan = await createLoan({
          amount,
          interest,
          duration,
          collateral,
          borrowerId,
          lenderId
        })
        return res.status(201).json(loan)

      default:
        logger.warn('Method not allowed', { method: req.method })
        res.setHeader('Allow', ['GET', 'POST'])
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error: any) {
    logger.error('Error handling loan request', { message: error.message })
    return res.status(500).json({ message: error.message })
  }
}
