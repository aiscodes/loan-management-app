import { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import logger from '../../../utils/logger'
import { validateLoanFields } from '../../../utils/validation'

const prisma = new PrismaClient()

// Handle GET request to fetch all loans
const handleGetRequest = async (res: VercelResponse) => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        borrower: true,
        lender: true
      }
    })

    return res.status(200).json(loans)
  } catch (error: any) {
    logger.error('Error fetching loans', { message: error.message })
    return res.status(500).json({ message: 'Failed to fetch loans' })
  }
}

// Handle POST request to create a new loan
const handlePostRequest = async (req: VercelRequest, res: VercelResponse) => {
  const { amount, interest, duration, collateral, borrowerId, lenderId } =
    req.body

  // Validate that borrowerId and lenderId are provided
  if (!borrowerId || !lenderId) {
    return res
      .status(400)
      .json({ message: 'borrowerId and lenderId are required' })
  }

  try {
    // Check if borrower and lender exist in the database
    const borrower = await prisma.user.findUnique({ where: { id: borrowerId } })
    const lender = await prisma.user.findUnique({ where: { id: lenderId } })

    if (!borrower || !lender) {
      return res.status(404).json({ message: 'Borrower or lender not found' })
    }

    // Validate loan data
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

    // Create the loan and connect it to the borrower and lender
    const newLoan = await prisma.loan.create({
      data: {
        amount: parseFloat(amount),
        interest: parseFloat(interest),
        duration: parseInt(duration, 10),
        collateral,
        borrower: { connect: { id: borrowerId } },
        lender: { connect: { id: lenderId } }
      },
      include: {
        borrower: true,
        lender: true
      }
    })

    return res.status(201).json(newLoan)
  } catch (error: any) {
    logger.error('Error creating loan', { message: error.message })
    return res.status(500).json({ message: 'Failed to create loan' })
  }
}

// Main handler for all requests
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
          .json({ message: `Method ${req.method} Not Allowed` }) // Return 405 if method is not allowed
    }
  } catch (error: any) {
    // Handle any unexpected errors
    logger.error('Unexpected API Error', { message: error.message })
    return res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    // Disconnect Prisma client to avoid memory leaks
    await prisma.$disconnect()
  }
}
