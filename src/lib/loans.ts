import { PrismaClient, Loan } from '@prisma/client'
import logger from '../utils/logger'
import { validateLoanFields } from './validation'

const prisma = new PrismaClient()

export const getAllLoans = async (): Promise<Loan[]> => {
  try {
    return await prisma.loan.findMany({
      include: {
        borrower: true,
        lender: true
      }
    })
  } catch (error: any) {
    logger.error('Error fetching loans', { message: error.message })
    throw new Error('Failed to fetch loans')
  }
}

export const getLoanById = async (id: string): Promise<Loan | null> => {
  try {
    return await prisma.loan.findUnique({
      where: { id },
      include: {
        borrower: true,
        lender: true
      }
    })
  } catch (error: any) {
    logger.error('Error fetching loan by id', { message: error.message })
    throw new Error('Failed to fetch loan details')
  }
}

export const createLoan = async ({
  amount,
  interest,
  duration,
  collateral,
  borrowerId,
  lenderId
}: {
  amount: string
  interest: string
  duration: string
  collateral: string
  borrowerId: string
  lenderId: string
}) => {
  const { isValid, message } = validateLoanFields({
    amount: parseFloat(amount),
    interest: parseFloat(interest),
    duration: parseInt(duration, 10),
    collateral
  })

  if (!isValid) {
    throw new Error(message)
  }

  try {
    const borrower = await prisma.user.findUnique({ where: { id: borrowerId } })
    const lender = await prisma.user.findUnique({ where: { id: lenderId } })

    if (!borrower || !lender) {
      throw new Error('Borrower or lender not found')
    }

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

    return newLoan
  } catch (error: any) {
    logger.error('Error creating loan', { message: error.message })
    throw new Error('Failed to create loan')
  }
}
