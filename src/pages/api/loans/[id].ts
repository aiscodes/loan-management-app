import { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import logger from '../../../utils/logger'
import { validateLoanFields, isValidUUID } from '../../../utils/validation'

const prisma = new PrismaClient()

// Handle GET request: Fetch loan by ID
const handleGetRequest = async (id: string, res: VercelResponse) => {
  // Try to find the loan in the database by its ID
  const loan = await prisma.loan.findUnique({ where: { id } })

  // If no loan is found, return a 404 error
  if (!loan) {
    logger.warn('Loan not found', { id, timestamp: new Date().toISOString() })
    return res.status(404).json({ message: 'Loan not found' })
  }

  // If the loan is found, return it with a 200 status
  return res.status(200).json(loan)
}

// Handle PUT request: Update loan details
const handlePutRequest = async (id: string, body: any, res: VercelResponse) => {
  const { amount, interest, duration, collateral } = body

  // Validate the provided loan fields
  const validation = validateLoanFields({
    amount,
    interest,
    duration,
    collateral
  })
  if (!validation.isValid) {
    logger.warn('Invalid loan fields', {
      body,
      timestamp: new Date().toISOString()
    })
    return res.status(400).json({ message: validation.message })
  }

  // If valid, update the loan in the database
  const updatedLoan = await prisma.loan.update({
    where: { id },
    data: { amount, interest, duration, collateral }
  })

  // Return the updated loan with a 200 status
  return res.status(200).json(updatedLoan)
}

// Handle DELETE request: Delete loan by ID
const handleDeleteRequest = async (id: string, res: VercelResponse) => {
  // Attempt to delete the loan from the database
  const deletedLoan = await prisma.loan.delete({ where: { id } })

  // Return a success message along with the deleted loan details
  return res
    .status(200)
    .json({ message: 'Loan deleted successfully', deletedLoan })
}

// Handle method not allowed: Return 405 if the method is not supported
const handleMethodNotAllowed = (method: string, res: VercelResponse) => {
  logger.warn('Method not allowed', {
    method,
    timestamp: new Date().toISOString()
  })

  // Set the allowed methods in the response header
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])

  // Return a 405 error indicating the method is not allowed
  return res.status(405).json({ message: `Method ${method} Not Allowed` })
}

// Main function to handle the request based on HTTP method
export default async (req: VercelRequest, res: VercelResponse) => {
  const {
    method,
    query: { id },
    body
  } = req

  // Validate if the provided loan ID is a valid UUID
  if (id && typeof id === 'string' && !isValidUUID(id)) {
    logger.warn('Invalid loan ID format', {
      id,
      timestamp: new Date().toISOString()
    })
    return res.status(400).json({ message: 'Invalid loan ID format' })
  }

  try {
    // Switch case to handle different HTTP methods
    switch (method) {
      case 'GET':
        return await handleGetRequest(id as string, res)
      case 'PUT':
        return await handlePutRequest(id as string, body, res)
      case 'DELETE':
        return await handleDeleteRequest(id as string, res)
      default:
        return handleMethodNotAllowed(method, res)
    }
  } catch (error: any) {
    // Log unexpected errors and return a 500 status
    logger.error('Unexpected error', {
      message: error.message,
      timestamp: new Date().toISOString()
    })
    return res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    // Disconnect from the Prisma database to avoid memory leaks
    await prisma.$disconnect()
  }
}
