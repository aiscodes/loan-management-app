import { VercelRequest, VercelResponse } from '@vercel/node'
import logger from '../../../utils/logger'
import { getLoanById, updateLoan } from '../../../lib/loans'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  try {
    switch (req.method) {
      case 'GET':
        const loan = await getLoanById(id as string)
        if (!loan) {
          return res.status(404).json({ message: 'Loan not found' })
        }
        return res.status(200).json(loan)

      case 'PUT':
        const { amount, interest, duration, collateral, borrowerId, lenderId } =
          req.body
        const updatedLoan = await updateLoan(id as string, {
          amount,
          interest,
          duration,
          collateral,
          borrowerId,
          lenderId
        })
        return res.status(200).json(updatedLoan)

      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error: any) {
    logger.error('Error handling loan request', { message: error.message })
    return res.status(500).json({ message: error.message })
  }
}
