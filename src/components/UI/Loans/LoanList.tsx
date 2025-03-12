import React, { Dispatch, SetStateAction, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loan } from '../../../types'
import ButtonGroup from '../ButtonGroup'
import Card from './LoanCard'

interface LoanListProps {
  loans: Loan[]
  setLoans: Dispatch<SetStateAction<Loan[]>>
  onEditLoan(loan: Loan): void
}

const LoanList: React.FC<LoanListProps> = ({ loans, setLoans, onEditLoan }) => {
  const [isDeletingLoan, setIsDeletingLoan] = useState<string | null>(null)
  const router = useRouter()

  const handleLoanDeletion = async (loanId: string) => {
    setIsDeletingLoan(loanId)

    const updatedLoans = loans.filter((loan) => loan.id !== loanId)
    setLoans(updatedLoans)

    try {
      await axios.delete(`/api/loans/${loanId}`)
      toast.success('Loan successfully deleted')
    } catch (error) {
      setLoans(loans)
      toast.error('Failed to delete loan. Please try again later.')
    } finally {
      setIsDeletingLoan(null)
    }
  }

  const handleLoanView = (loanId: string) => {
    router.push(`/loans/${loanId}`)
  }

  if (loans.length === 0) {
    return <p className="mt-8 text-center">No loans available at the moment.</p>
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {loans.map((loan) => (
        <Card
          key={loan.id}
          loan={loan}
          ButtonGroup={
            <ButtonGroup
              loan={loan}
              isDeletingLoan={isDeletingLoan}
              onEditLoan={onEditLoan}
              onDeleteLoan={handleLoanDeletion}
              onViewLoan={handleLoanView}
            />
          }
        />
      ))}
    </div>
  )
}

export default LoanList
