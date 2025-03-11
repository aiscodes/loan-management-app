import { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import logger from '../../../utils/logger'
import { validateLoanFields } from '../../../utils/validation'

const prisma = new PrismaClient()

const handleGetRequest = async (res: VercelResponse) => {
  try {
    const loans = await prisma.loan.findMany()
    return res.status(200).json(loans)
  } catch (error: any) {
    logger.error('Error fetching loans', { message: error.message })
    return res.status(500).json({ message: 'Failed to fetch loans' })
  }
}

const handlePostRequest = async (req: VercelRequest, res: VercelResponse) => {
  const { amount, interest, duration, collateral } = req.body

  // Validate loan fields
  const { isValid, message } = validateLoanFields({
    amount,
    interest,
    duration,
    collateral
  })

  if (!isValid) {
    logger.warn('Validation failed for loan creation', { body: req.body })
    return res.status(400).json({ message })
  }

  try {
    // Create a new loan in the database
    const newLoan = await prisma.loan.create({
      data: {
        amount: parseFloat(amount),
        interest: parseFloat(interest),
        duration: parseInt(duration, 10),
        collateral
      }
    })
    return res.status(201).json(newLoan)
  } catch (error: any) {
    logger.error('Error creating loan', { message: error.message })
    return res.status(500).json({ message: 'Failed to create loan' })
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
        logger.warn('Method not allowed', { method: req.method })
        res.setHeader('Allow', ['GET', 'POST'])
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error: any) {
    // General catch-all error handling
    logger.error('Unexpected API Error', { message: error.message })
    return res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    // Always disconnect Prisma client to avoid memory leaks
    await prisma.$disconnect()
  }
}
