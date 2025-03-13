import prisma from './prisma'
import logger from '../utils/logger'

// Create a user (can be a borrower and/or lender)
export const createUser = async (formData: {
  name: string
  email: string
  isBorrower?: boolean
  isLender?: boolean
  loanData?: {
    amount: number
    interest: number
    duration: number
    collateral: string
  }
}) => {
  try {
    // Validate that name and email are provided
    if (!formData.name || !formData.email) {
      logger.warn('Validation failed for user creation', { formData })
      return { success: false, error: 'Name and email are required' }
    }

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        isBorrower: formData.isBorrower ?? false, // Set isBorrower based on input, default to false
        isLender: formData.isLender ?? false // Set isLender based on input, default to false
      }
    })

    logger.log('User created successfully', {
      userId: user.id,
      email: user.email
    })

    // If the user is a borrower and has loan data, create a loan
    if (formData.isBorrower && formData.loanData) {
      const { amount, interest, duration, collateral } = formData.loanData

      // Create a loan for the borrower
      const loan = await prisma.loan.create({
        data: {
          amount,
          interest,
          duration,
          collateral,
          status: 'PENDING', // Set loan status as 'PENDING' initially
          borrower: { connect: { id: user.id } },
          lender: { connect: { id: formData.isLender ? user.id : '' } }
        }
      })

      logger.log('Loan created successfully', {
        loanId: loan.id,
        amount: loan.amount,
        borrowerId: loan.borrowerId,
        lenderId: loan.lenderId
      })
    }

    return { success: true, data: user }
  } catch (error: any) {
    // Handle the case where a user with the same email already exists
    if (error.code === 'P2002') {
      logger.warn('User already exists', { email: formData.email })
      return { success: false, error: 'A user with this email already exists' }
    }

    // Log any other errors
    logger.error('Error creating user', { message: error.message })
    return { success: false, error: 'Failed to create user' }
  }
}

// Fetch all users
export const getUsers = async () => {
  try {
    // Retrieve all users from the database, ordered by name
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    })

    logger.log('Fetched all users', { count: users.length })
    return { success: true, data: users }
  } catch (error) {
    // Log any errors that occur while fetching users
    logger.error('Error fetching users', { message: error })
    return { success: false, error: 'Failed to fetch users' }
  }
}

// Fetch a user by ID
export const getUserById = async (id: string) => {
  try {
    // Retrieve a user by ID from the database
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return null
    }

    return user
  } catch (error: any) {
    logger.error('Error fetching user by ID', { message: error.message })
    return null
  }
}
