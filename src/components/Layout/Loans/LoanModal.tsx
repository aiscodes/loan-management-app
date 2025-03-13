import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  FormEvent,
  Dispatch,
  SetStateAction
} from 'react'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'

import { Loan, LoanStatus, ModalHandles, User } from '../../../types'
import { calculateAPR } from '../../../utils'
import { validateCollateral } from '../../../lib/validation'
import SelectInput from '../../UI/SelectInput'
import { Box, Typography } from '@mui/material'

interface Props {
  loans: Loan[]
  setLoans: Dispatch<SetStateAction<Loan[]>>
  users: User[]
}

const LoanModal: React.ForwardRefRenderFunction<ModalHandles, Props> = (
  { loans, setLoans, users },
  ref
) => {
  const [visible, setVisible] = useState(false)
  const [amount, setAmount] = useState(15000)
  const [interest, setInterest] = useState(calculateAPR(24))
  const [duration, setDuration] = useState(24)
  const [collateral, setCollateral] = useState('')
  const [loan, setLoan] = useState<Loan | null>(null)
  const [status, setStatus] = useState<LoanStatus>('PENDING')
  const [borrowerId, setBorrowerId] = useState('')
  const [lenderId, setLenderId] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [collateralError, setCollateralError] = useState('')

  const clearFields = useCallback(() => {
    setAmount(15000)
    setInterest(calculateAPR(24))
    setDuration(24)
    setCollateral('')
    setLoan(null)
    setCollateralError('')
    setStatus('PENDING')
    setBorrowerId('')
    setLenderId('')
  }, [])

  const closeModal = useCallback(() => {
    clearFields()
    setVisible(false)
  }, [clearFields])

  const openModal = useCallback(() => {
    setVisible(true)
  }, [])

  const openEditModal = useCallback((loan: Loan) => {
    setAmount(loan.amount ?? 15000)
    setInterest(loan.interest ?? calculateAPR(24))
    setDuration(loan.duration ?? 24)
    setCollateral(loan.collateral ?? '')
    setLoan(loan)
    setStatus(loan.status ?? 'PENDING')
    setBorrowerId(loan.borrowerId ?? '')
    setLenderId(loan.lenderId ?? '')
    setVisible(true)
  }, [])

  useImperativeHandle(ref, () => ({
    openModal,
    openEditModal
  }))

  const calculateMonthlyPayment = () => {
    const monthlyRate = interest / 100 / 12
    const numPayments = duration
    const monthlyPayment =
      (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments))
    return monthlyPayment.toFixed(0)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!borrowerId || !lenderId) {
      toast.error('Both Borrower and Lender must be selected.')
      return
    }

    if (borrowerId === lenderId) {
      toast.error('Borrower and Lender cannot be the same person.')
      return
    }

    const { isValid, message } = validateCollateral(collateral)
    if (!isValid) {
      setCollateralError(message || '')
      return
    }

    try {
      setButtonDisabled(true)
      const newLoan = {
        amount,
        interest,
        duration,
        collateral,
        borrowerId,
        lenderId,
        status
      }

      if (loan) {
        await axios.put(`/api/loans/${loan.id}`, newLoan)
        toast.success('Loan updated successfully')
        setLoans(
          loans.map((l) => (l.id === loan.id ? { ...l, ...newLoan } : l))
        )
      } else {
        const response = await axios.post('/api/loans', newLoan)
        toast.success('Loan added successfully')
        setLoans([...loans, response.data])
      }

      closeModal()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Error saving loan, please try again.'
      )
    } finally {
      setButtonDisabled(false)
    }
  }

  if (!visible) return null

  return (
    <Box className="modal-background">
      <Box className="modal-content w-2/3">
        <Box className="modal-header">
          <Typography className="text-2xl font-semibold text-white">
            {loan ? 'Update Loan' : 'Add Loan'}
          </Typography>
          <button
            className="cursor-pointer text-white hover:text-gray-200"
            onClick={closeModal}
          >
            <FiX size={24} />
          </button>
        </Box>

        <Box className="modal-body">
          <Typography className="mb-2 text-lg font-medium text-white">
            Estimated Monthly Payment
          </Typography>
          <Typography className="my-2 text-4xl font-bold text-white">
            ${calculateMonthlyPayment()}
          </Typography>
          <Typography className="mt-2 text-base text-gray-200">
            {parseFloat(interest.toFixed(2))}% APR
            <br />
            Total Cost: $
            {(Number(calculateMonthlyPayment()) * duration).toFixed(0)}
          </Typography>
        </Box>

        <Box className="flex gap-8">
          <Box className="w-1/2">
            <SelectInput
              label="Borrower"
              value={borrowerId}
              onChange={setBorrowerId}
              options={users
                .filter((user) => user.isBorrower)
                .map((user) => ({ value: user.id, label: user.name }))}
            />

            <SelectInput
              label="Lender"
              value={lenderId}
              onChange={setLenderId}
              options={users
                .filter((user) => user.isLender && user.id !== borrowerId)
                .map((user) => ({ value: user.id, label: user.name }))}
            />

            <SelectInput
              label="Status"
              value={status}
              onChange={(value) => setStatus(value as LoanStatus)}
              options={[
                { value: 'PENDING', label: 'Pending' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'PAID', label: 'Paid' },
                { value: 'DEFAULTED', label: 'Defaulted' }
              ]}
            />
          </Box>

          <Box className="w-1/2">
            <Box className="mb-6">
              <label>Amount: ${amount}</label>
              <input
                type="range"
                min="10000"
                max="200000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="slider"
              />
            </Box>

            <Box className="mb-6">
              <label>Length: {duration} Months</label>
              <input
                type="range"
                min="12"
                max="60"
                value={duration}
                onChange={(e) => {
                  const newDuration = Number(e.target.value)
                  setDuration(newDuration)
                  setInterest(calculateAPR(newDuration))
                }}
                className="slider"
              />
            </Box>

            <label>Collateral:</label>
            <input
              type="text"
              className={`input-style ${collateralError ? 'border-red-500' : ''}`}
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="Enter collateral details"
            />
            {collateralError && (
              <Typography className="mt-1 text-sm text-red-500">
                {collateralError}
              </Typography>
            )}
          </Box>
        </Box>

        <Box className="modal-footer flex gap-4">
          <button className="btn-secondary" type="button" onClick={closeModal}>
            Cancel
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={handleSubmit}
            disabled={buttonDisabled}
          >
            {loan ? 'Update Loan' : 'Add Loan'}
          </button>
        </Box>
      </Box>
    </Box>
  )
}

export default forwardRef(LoanModal)
