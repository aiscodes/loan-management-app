'use server'

import { prisma } from './prisma'
import { Prisma } from '@prisma/client'
import { VercelRequest, VercelResponse } from '@vercel/node'
import logger from '../../../utils/logger'
import { validateLoanFields, isValidUUID } from '../../../utils/validation'

interface LoanUpdateData {
  amount?: number
  interest?: number
  duration?: number
  collateral?: string
  status?: 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED'
  borrowerId?: string
  lenderId?: string
}

// Handle POST request: Create a new loan
const handlePostRequest = async (req: VercelRequest, res: VercelResponse) => {
  const {
    amount,
    interest,
    duration,
    collateral,
    borrowerId,
    lenderId,
    status
  } = req.body

  // Check that borrowerId and lenderId are provided
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

    // Check if the borrower and lender have valid roles
    if (!borrower.isBorrower) {
      return res.status(400).json({ message: 'User is not a valid borrower' })
    }

    if (!lender.isLender) {
      return res.status(400).json({ message: 'User is not a valid lender' })
    }

    // Validate fields
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

    // Create the loan with borrower and lender connections
    const newLoan = await prisma.loan.create({
      data: {
        amount: parseFloat(amount),
        interest: parseFloat(interest),
        duration: parseInt(duration, 10),
        collateral,
        status: status || 'PENDING', // Default status if not provided
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

// Handle GET request: Fetch loan by ID
const handleGetRequest = async (id: string, res: VercelResponse) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id },
      include: { borrower: true, lender: true }
    })

    if (!loan) {
      logger.warn('Loan not found', { id, timestamp: new Date().toISOString() })
      return res.status(404).json({ message: 'Loan not found' })
    }

    return res.status(200).json(loan)
  } catch (error: any) {
    logger.error('Error fetching loan', { message: error.message })
    return res.status(500).json({ message: 'Failed to fetch loan' })
  }
}

// Handle PUT request: Update loan details
const handlePutRequest = async (
  id: string,
  body: LoanUpdateData,
  res: VercelResponse
) => {
  const {
    amount,
    interest,
    duration,
    collateral,
    status,
    borrowerId,
    lenderId
  } = body

  // Validate fields
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

  try {
    const updatedLoan = await prisma.loan.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount.toString()) : undefined,
        interest: interest ? parseFloat(interest.toString()) : undefined,
        duration: duration ? parseInt(duration.toString(), 10) : undefined,
        collateral,
        status: status ? status : undefined,
        borrower: borrowerId ? { connect: { id: borrowerId } } : undefined,
        lender: lenderId ? { connect: { id: lenderId } } : undefined
      }
    })

    return res.status(200).json(updatedLoan)
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Loan not found' })
    }

    logger.error('Error updating loan', { message: error.message })
    return res.status(500).json({ message: 'Failed to update loan' })
  }
}

// Handle DELETE request: Delete loan by ID
const handleDeleteRequest = async (id: string, res: VercelResponse) => {
  try {
    const deletedLoan = await prisma.loan.delete({ where: { id } })
    return res
      .status(200)
      .json({ message: 'Loan deleted successfully', deletedLoan })
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ message: 'Loan not found' })
    }

    logger.error('Error deleting loan', { message: error.message })
    return res.status(500).json({ message: 'Failed to delete loan' })
  }
}

// Handle method not allowed
const handleMethodNotAllowed = (method: string, res: VercelResponse) => {
  logger.warn('Method not allowed', {
    method,
    timestamp: new Date().toISOString()
  })
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ message: `Method ${method} Not Allowed` })
}

// Main function to handle the request
export default async (req: VercelRequest, res: VercelResponse) => {
  const {
    method,
    query: { id },
    body
  } = req

  if (!id || typeof id !== 'string' || !isValidUUID(id)) {
    logger.warn('Invalid loan ID format', {
      id,
      timestamp: new Date().toISOString()
    })
    return res.status(400).json({ message: 'Invalid loan ID format' })
  }

  try {
    switch (method) {
      case 'GET':
        return await handleGetRequest(id, res)
      case 'POST':
        return await handlePostRequest(req, res)
      case 'PUT':
        return await handlePutRequest(id, body as LoanUpdateData, res)
      case 'DELETE':
        return await handleDeleteRequest(id, res)
      default:
        return handleMethodNotAllowed(method, res)
    }
  } catch (error: any) {
    logger.error('Unexpected error', {
      message: error.message,
      timestamp: new Date().toISOString()
    })
    return res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    await prisma.$disconnect()
  }
}
