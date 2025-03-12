import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  FormEvent,
  Dispatch,
  SetStateAction
} from 'react'
import { FiX, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'

import { Loan, ModalHandles } from '../../../types'
import { calculateAPR } from '../../../utils'
import { validateCollateral } from '../../../utils/validation'

interface Props {
  loans: Array<Loan>
  setLoans: Dispatch<SetStateAction<Loan[]>>
}

const Modal: React.ForwardRefRenderFunction<ModalHandles, Props> = (
  { loans, setLoans },
  ref
) => {
  const [visible, setVisible] = useState(false)
  const [amount, setAmount] = useState(15000)
  const [interest, setInterest] = useState(calculateAPR(24))
  const [duration, setDuration] = useState(24)
  const [collateral, setCollateral] = useState('')
  const [loan, setLoan] = useState<Loan | null>(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [collateralError, setCollateralError] = useState('')

  const clearFields = useCallback(() => {
    setAmount(15000)
    setInterest(calculateAPR(24))
    setDuration(24)
    setCollateral('')
    setLoan(null)
    setCollateralError('')
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

    // Collateral validation
    const { isValid, message } = validateCollateral(collateral)
    if (!isValid) {
      setCollateralError(message || '')
      return
    }

    try {
      setButtonDisabled(true)
      const newLoan = { amount, interest, duration, collateral }
      if (loan) {
        await axios.put(`/api/loans/${loan.id}`, newLoan)
        toast.success('Loan updated successfully')
        setLoans(
          loans.map((l) => (l.id === loan.id ? { ...newLoan, id: loan.id } : l))
        )
      } else {
        const response = await axios.post('/api/loans', newLoan)
        toast.success('Loan added successfully')
        setLoans([...loans, { ...response.data }])
      }
      closeModal()
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error saving loan, please try again.'
      toast.error(errorMessage)
    } finally {
      setButtonDisabled(false)
    }
  }

  const handleCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollateral(e.target.value)
    if (collateralError) {
      setCollateralError('')
    }
  }

  if (!visible) return null

  return (
    <div className="modal-background">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="letter-spacing text-2xl font-semibold text-white">
            {loan ? 'Update Loan' : 'Add Loan'}
          </h3>
          <button
            className="cursor-pointer text-white transition duration-300 ease-in-out hover:text-gray-200"
            onClick={closeModal}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          <p className="mb-2 text-lg font-medium text-white">
            Estimated Monthly Payment
          </p>
          <h1 className="my-2 text-4xl font-bold leading-tight text-white">
            ${calculateMonthlyPayment()}
          </h1>
          <p className="mt-2 text-base text-gray-200">
            {parseFloat(interest.toFixed(2))}% APR
            <br />
            Total Cost: $
            {(Number(calculateMonthlyPayment()) * duration).toFixed(0)}
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-6">
          <label className="slider-label">Amount: ${amount}</label>
          <input
            className="slider"
            type="range"
            min="10000"
            max="200000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

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

          <label className="slider-label">Collateral:</label>
          <input
            type="text"
            className={`input-style ${collateralError ? 'border-red-500' : ''}`}
            value={collateral}
            onChange={handleCollateralChange}
            placeholder="Enter collateral details"
          />
          {collateralError && (
            <p className="mt-1 text-sm text-red-500">{collateralError}</p>
          )}
        </div>

        <div className="modal-footer flex gap-4">
          <button
            className="icon-button icon-button-delete px-5 py-2 text-sm"
            type="button"
            onClick={closeModal}
          >
            <FiX size={18} className="mr-2" />
            Cancel
          </button>
          <button
            className="btn btn-primary px-5 py-2 text-sm"
            type="button"
            onClick={handleSubmit}
            disabled={buttonDisabled}
          >
            <FiPlus size={18} className="mr-2" />
            {loan ? 'Update Loan' : 'Add Loan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(Modal)
