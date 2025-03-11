import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Head from 'next/head'
import MainPage from '../../components/Layout/MainPage'
import { Loan } from '../../types'
import ActionButton from '../../components/UI/ButtonGroup/ActionButton'

const LoanDetails = () => {
  const router = useRouter()
  const { id } = router.query

  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchLoanDetails(id as string)
    }
  }, [id])

  const fetchLoanDetails = async (loanId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/loans/${loanId}`)
      setLoan(response.data)
    } catch (error) {
      toast.error('Failed to fetch loan details')
      setError('No loan found with the provided ID.')
    } finally {
      setLoading(false)
    }
  }

  const LoanDetail = ({ label, value }: { label: string; value: string }) => (
    <div className="flex-row">
      <p className="loan-detail-text">
        {label}: {value}
      </p>
    </div>
  )

  const renderLoanDetails = () => (
    <div className="bg-darkPrimary my-8 flex w-full flex-col items-center justify-center rounded-lg p-8 text-white shadow-lg">
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
          loan?.createdAt ? new Date(loan.createdAt).toLocaleString() : 'N/A'
        }
      />
      <LoanDetail
        label="Updated At"
        value={
          loan?.updatedAt ? new Date(loan.updatedAt).toLocaleString() : 'N/A'
        }
      />
      <ActionButton
        onClick={() => router.back()}
        label="Go Back"
        ariaLabel="Go Back"
        className="btn btn-secondary bg-white text-black hover:bg-gray-100 focus:outline-none"
      />
    </div>
  )

  return (
    <MainPage
      additionalText={
        loading
          ? 'Please wait while we load the loan information...'
          : loan
            ? `Detailed information for ${loan.collateral}`
            : 'Sorry, no loan details were found for the given ID.'
      }
    >
      <Head>
        <title>Loan Details</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && (
        <p className="text-center text-lg font-medium">
          Please wait while we load the loan information...
        </p>
      )}

      {error && (
        <p className="text-center text-lg font-medium text-red-500">{error}</p>
      )}

      {!loading && !loan && !error && (
        <p className="text-center text-lg font-medium text-red-500">
          Sorry, no loan details were found for the given ID.
        </p>
      )}

      {!loading && loan && renderLoanDetails()}
    </MainPage>
  )
}

export default LoanDetails
