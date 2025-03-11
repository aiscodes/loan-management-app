import { calculateAPR } from '.'

interface LoanFields {
  amount: number
  interest: number
  duration: number
  collateral: string
}

// Enum for standard error messages
enum LoanErrorMessages {
  INVALID_AMOUNT = 'Amount must be between 10,000 and 200,000.',
  INVALID_INTEREST = 'Interest must be between 7 and 20.',
  INVALID_DURATION = 'Duration must be between 12 and 60 months.',
  COLLATERAL_EMPTY = 'Collateral cannot be empty.',
  COLLATERAL_MAX_LENGTH = 'Collateral must have a maximum of 20 characters.',
  COLLATERAL_INVALID_CHARACTERS = 'Collateral must only contain English letters and spaces.',
  INTEREST_MISMATCH = 'Interest must match the calculated APR.'
}

// Function to validate the loan fields
export const validateLoanFields = ({
  amount,
  interest,
  duration,
  collateral
}: LoanFields): { isValid: boolean; message?: string } => {
  const computedAPR = calculateAPR(duration)

  // Check if the interest matches the calculated APR
  if (computedAPR !== interest) {
    return {
      isValid: false,
      message: `${LoanErrorMessages.INTEREST_MISMATCH} Expected APR: ${computedAPR.toFixed(2)}%, received: ${interest.toFixed(2)}%.`
    }
  }

  // Check if the amount is within the valid range
  if (amount < 10_000 || amount > 200_000) {
    return { isValid: false, message: LoanErrorMessages.INVALID_AMOUNT }
  }

  // Check if the interest rate is within the valid range
  if (interest < 7 || interest > 20) {
    return { isValid: false, message: LoanErrorMessages.INVALID_INTEREST }
  }

  // Check if the duration is within the valid range
  if (duration < 12 || duration > 60) {
    return { isValid: false, message: LoanErrorMessages.INVALID_DURATION }
  }

  // Collateral validation
  const collateralValidation = validateCollateral(collateral)
  if (!collateralValidation.isValid) {
    return { isValid: false, message: collateralValidation.message }
  }

  return { isValid: true }
}

// Function to validate the collateral (checking if it's not empty, has max 20 characters, and contains only English letters)
export const validateCollateral = (collateral: string) => {
  // Check if collateral is empty
  if (!collateral.trim()) {
    return { isValid: false, message: LoanErrorMessages.COLLATERAL_EMPTY }
  }

  // Check if collateral exceeds the maximum length of 20 characters
  if (collateral.length > 20) {
    return { isValid: false, message: LoanErrorMessages.COLLATERAL_MAX_LENGTH }
  }

  // Check if collateral contains only English letters and spaces
  if (!/^[A-Za-z ]+$/.test(collateral)) {
    return {
      isValid: false,
      message: LoanErrorMessages.COLLATERAL_INVALID_CHARACTERS
    }
  }

  return { isValid: true }
}

// Function to validate a UUID format
export const isValidUUID = (uuid: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  )
