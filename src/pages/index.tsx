import Head from 'next/head'
import { useState, useCallback, useRef } from 'react'
import MainPage from '../components/Layout/MainPage'
import { GetServerSideProps } from 'next'
import { getLoans } from '../utils'
import { Loan, ModalHandles } from '../types'
import ActionButton from '../components/UI/ButtonGroup/ActionButton'
import { FiPlus } from 'react-icons/fi'
import LoanList from '../components/UI/Loans/LoanList'
import LoanModal from '../components/UI/Loans/LoanModal'

interface HomeProps {
  loans: Loan[]
}

const Home = ({ loans: storedLoans }: HomeProps) => {
  const [loans, setLoans] = useState<Array<Loan>>(storedLoans)
  const [activeTab, setActiveTab] = useState('loans') // Track active tab
  const modalRef = useRef<ModalHandles>(null)

  const openModal = useCallback(() => {
    modalRef.current?.openModal()
  }, [])

  const openEditModal = useCallback((loan: Loan) => {
    modalRef.current?.openEditModal(loan)
  }, [])

  return (
    <>
      <Head>
        <title>Loan Tracker</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <MainPage
        actionButton={
          <ActionButton
            icon={<FiPlus size={18} />}
            className="btn btn-primary"
            onClick={openModal}
            label="Create a new loan"
            ariaLabel="Create a new loan"
          />
        }
      >
        <div className="flex">
          <div className="flex w-1/4 flex-col">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-left text-lg font-medium ${
                activeTab === 'users' ? 'bg-gray-300' : 'bg-gray-100'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-4 py-2 text-left text-lg font-medium ${
                activeTab === 'loans' ? 'bg-gray-300' : 'bg-gray-100'
              }`}
            >
              Loans
            </button>
          </div>

          <div className="ml-8 w-full">
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Users</h3>
                <div className="rounded-lg bg-gray-200 p-4">
                  Users will be listed here...
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Loans</h3>
                <div className="rounded-lg bg-gray-200 p-4">
                  <LoanList
                    loans={loans}
                    onEditLoan={openEditModal}
                    setLoans={setLoans}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </MainPage>
      <LoanModal loans={loans} setLoans={setLoans} ref={modalRef} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const loans = await (
      await getLoans()
    ).map((loan) => ({
      ...loan,
      createdAt:
        loan.createdAt instanceof Date
          ? loan.createdAt.toISOString()
          : loan.createdAt,
      updatedAt:
        loan.updatedAt instanceof Date
          ? loan.updatedAt.toISOString()
          : loan.updatedAt
    }))

    return {
      props: {
        loans
      }
    }
  } catch (error) {
    console.error('Error fetching loans:', error)
    return {
      props: {
        loans: []
      }
    }
  }
}

export default Home
