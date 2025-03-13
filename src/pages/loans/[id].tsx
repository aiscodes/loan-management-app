import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Head from 'next/head'
import MainPage from '../../components/Layout/MainPage'
import { Loan, User } from '../../types'
import ActionButton from '../../components/UI/ButtonGroup/ActionButton'
import { Box, Typography } from '@mui/material'

const LoanDetails = () => {
  const router = useRouter()
  const { id } = router.query

  const [loan, setLoan] = useState<Loan | null>(null)
  const [borrower, setBorrower] = useState<User | null>(null)
  const [lender, setLender] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) fetchLoanDetails(id as string)
  }, [id])

  const fetchLoanDetails = async (loanId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.get(`/api/loans/${loanId}`)
      setLoan(data)

      if (data.borrowerId) {
        const { data: borrowerData } = await axios.get(
          `/api/users/${data.borrowerId}`
        )
        setBorrower(borrowerData)
      }

      if (data.lenderId) {
        const { data: lenderData } = await axios.get(
          `/api/users/${data.lenderId}`
        )
        setLender(lenderData)
      }
    } catch (error) {
      toast.error('Failed to fetch loan details')
      setError('No loan found with the provided ID.')
    } finally {
      setLoading(false)
    }
  }

  const LoanDetail = ({ label, value }: { label: string; value: string }) => (
    <Box className="flex justify-between border-b border-highlight py-2">
      <Typography className="text-gray-300">{label}:</Typography>
      <Typography className="font-semibold text-white">{value}</Typography>
    </Box>
  )

  const renderLoanDetails = () => (
    <Box className="mx-auto mt-2 w-full max-w-5xl rounded-lg bg-darkSecondary p-8 shadow-lg">
      <Box className="grid grid-cols-2 gap-8">
        <Box className="space-y-3">
          <Typography className="border-b border-highlight pb-2 text-xl font-semibold text-white">
            Loan Information
          </Typography>
          <LoanDetail label="ID" value={loan?.id ?? 'N/A'} />
          <LoanDetail label="Amount" value={`$${loan?.amount ?? 'N/A'}`} />
          <LoanDetail
            label="Interest"
            value={`${loan?.interest.toFixed(2) ?? 'N/A'}%`}
          />
          <LoanDetail label="Duration" value={`${loan?.duration} months`} />
          <LoanDetail label="Collateral" value={loan?.collateral ?? 'N/A'} />
          <LoanDetail
            label="Created At"
            value={
              loan?.createdAt
                ? new Date(loan.createdAt).toLocaleString()
                : 'N/A'
            }
          />
          <LoanDetail
            label="Updated At"
            value={
              loan?.updatedAt
                ? new Date(loan.updatedAt).toLocaleString()
                : 'N/A'
            }
          />
        </Box>

        <Box className="space-y-6">
          {borrower && (
            <Box>
              <Typography className="border-b border-highlight pb-2 text-xl font-semibold text-white">
                Borrower Information
              </Typography>
              <LoanDetail label="Name" value={borrower.name ?? 'N/A'} />
              <LoanDetail label="Email" value={borrower.email ?? 'N/A'} />
            </Box>
          )}

          {lender && (
            <Box>
              <Typography className="border-b border-highlight pb-2 text-xl font-semibold text-white">
                Lender Information
              </Typography>
              <LoanDetail label="Name" value={lender.name ?? 'N/A'} />
              <LoanDetail label="Email" value={lender.email ?? 'N/A'} />
            </Box>
          )}
        </Box>
      </Box>

      <Box className="mt-6 flex justify-center">
        <ActionButton
          onClick={() => router.back()}
          label="Go Back"
          ariaLabel="Go Back"
          className="btn btn-secondary bg-muted text-white hover:bg-highlight focus:outline-none"
        />
      </Box>
    </Box>
  )

  return (
    <MainPage
      additionalText={
        loading
          ? 'Loading loan information...'
          : loan
            ? `Detailed information for loan #${loan.id}`
            : 'No loan details found.'
      }
    >
      <Head>
        <title>Loan Details</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && (
        <Typography className="text-center text-lg text-lightAccent">
          Loading...
        </Typography>
      )}

      {error && (
        <Typography className="text-center text-lg text-red-500">
          {error}
        </Typography>
      )}

      {!loading && loan && renderLoanDetails()}
    </MainPage>
  )
}

export default LoanDetails
