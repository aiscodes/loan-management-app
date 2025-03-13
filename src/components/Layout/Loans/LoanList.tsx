import React, { Dispatch, SetStateAction, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loan } from '../../../types'
import ButtonGroup from '../../UI/ButtonGroup'
import Card from './LoanCard'
import { Typography, Box } from '@mui/material'

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
    return (
      <Typography className="my-8 text-center">
        No loans available at the moment.
      </Typography>
    )
  }

  return (
    <Box className="list-grid">
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
    </Box>
  )
}

export default LoanList
