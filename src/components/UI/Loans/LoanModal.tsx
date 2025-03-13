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
          loans.map((l) => {
            if (l.id === loan.id) {
              return { ...l, ...newLoan }
            }
            return l
          })
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
    <div className="modal-background">
      <div className="modal-content w-2/3">
        <div className="modal-header">
          <h3 className="text-2xl font-semibold text-white">
            {loan ? 'Update Loan' : 'Add Loan'}
          </h3>
          <button
            className="cursor-pointer text-white hover:text-gray-200"
            onClick={closeModal}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          <p className="mb-2 text-lg font-medium text-white">
            Estimated Monthly Payment
          </p>
          <h1 className="my-2 text-4xl font-bold text-white">
            ${calculateMonthlyPayment()}
          </h1>
          <p className="mt-2 text-base text-gray-200">
            {parseFloat(interest.toFixed(2))}% APR
            <br />
            Total Cost: $
            {(Number(calculateMonthlyPayment()) * duration).toFixed(0)}
          </p>
        </div>

        <div className="flex gap-8">
          <div className="w-1/2">
            <label>Borrower:</label>
            <select
              className="input-style"
              value={borrowerId}
              onChange={(e) => setBorrowerId(e.target.value)}
            >
              <option value="">Select Borrower</option>
              {users &&
                Array.isArray(users) &&
                users
                  .filter((user) => user.isBorrower)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
            </select>
            {borrowerId === '' && (
              <p className="mt-1 text-sm text-red-500">
                Please select a borrower.
              </p>
            )}

            <label>Lender:</label>
            <select
              className="input-style"
              value={lenderId}
              onChange={(e) => setLenderId(e.target.value)}
            >
              <option value="">Select Lender</option>
              {users &&
                Array.isArray(users) &&
                users
                  .filter((user) => user.isLender && user.id !== borrowerId)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
            </select>
            {lenderId === '' && (
              <p className="mt-1 text-sm text-red-500">
                Please select a lender.
              </p>
            )}

            <label>Status:</label>
            <select
              className="input-style"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="PAID">Paid</option>
              <option value="DEFAULTED">Defaulted</option>
            </select>
          </div>

          <div className="w-1/2">
            <div className="mb-6">
              <label>Amount: ${amount}</label>
              <input
                type="range"
                min="10000"
                max="200000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="mb-6">
              <label className="slider-label">Length: {duration} Months</label>
              <input
                className="slider"
                type="range"
                min="12"
                max="60"
                value={duration}
                onChange={(e) => {
                  const newDuration = Number(e.target.value)
                  setDuration(newDuration)
                  setInterest(calculateAPR(newDuration))
                }}
              />
            </div>
            <label>Collateral:</label>
            <input
              type="text"
              className={`input-style ${collateralError ? 'border-red-500' : ''}`}
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="Enter collateral details"
            />
            {collateralError && (
              <p className="mt-1 text-sm text-red-500">{collateralError}</p>
            )}
          </div>
        </div>

        <div className="modal-footer flex gap-4">
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
        </div>
      </div>
    </div>
  )
}

export default forwardRef(LoanModal)
