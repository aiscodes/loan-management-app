import Head from 'next/head'
import { useState, useCallback, useRef } from 'react'
import MainPage from '../components/Layout/MainPage'
import { GetServerSideProps } from 'next'
import { getLoans, getUsers } from '../utils'
import { Loan, ModalHandles, User } from '../types'
import ActionButton from '../components/UI/ButtonGroup/ActionButton'
import { FiPlus } from 'react-icons/fi'
import LoanList from '../components/UI/Loans/LoanList'
import LoanModal from '../components/UI/Loans/LoanModal'
import UserList from '../components/UI/Users/UserList'
import UserModal from '../components/UI/Users/UserModal'

interface HomeProps {
  loans: Loan[]
  users: User[]
}

const Home = ({ loans: storedLoans, users: storedUsers }: HomeProps) => {
  const [loans, setLoans] = useState<Array<Loan>>(storedLoans)
  const [users, setUsers] = useState<Array<User>>(storedUsers)
  const [activeTab, setActiveTab] = useState('loans')

  // Отдельные рефы для модалок
  const loanModalRef = useRef<ModalHandles>(null)
  const userModalRef = useRef<ModalHandles>(null)

  const openLoanModal = useCallback(() => {
    loanModalRef.current?.openModal()
  }, [])

  const openUserModal = useCallback(() => {
    userModalRef.current?.openModal()
  }, [])

  const openEditLoanModal = useCallback((loan: Loan) => {
    loanModalRef.current?.openEditModal(loan)
  }, [])

  return (
    <>
      <Head>
        <title>Loan Tracker</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <MainPage>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Users</h3>
                  <ActionButton
                    icon={<FiPlus size={18} />}
                    className="btn btn-primary"
                    onClick={openUserModal}
                    label="Create a new user"
                    ariaLabel="Create a new user"
                  />
                </div>

                <div className="rounded-lg bg-gray-200 p-4">
                  <UserList users={users} />
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Loans</h3>
                  <ActionButton
                    icon={<FiPlus size={18} />}
                    className="btn btn-primary"
                    onClick={openLoanModal}
                    label="Create a new loan"
                    ariaLabel="Create a new loan"
                  />
                </div>
                <div className="rounded-lg bg-gray-200 p-4">
                  <LoanList
                    loans={loans}
                    onEditLoan={openEditLoanModal}
                    setLoans={setLoans}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </MainPage>

      {/* Передаем отдельные рефы для каждой модалки */}
      <LoanModal
        loans={loans}
        setLoans={setLoans}
        ref={loanModalRef}
        users={users}
      />
      <UserModal users={users} setUsers={setUsers} ref={userModalRef} />
    </>
  )
}

export default Home

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

    const users = await getUsers()
    const usersWithDates = users.map((user) => ({
      ...user,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.toISOString()
          : user.createdAt,
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt.toISOString()
          : user.updatedAt
    }))

    return {
      props: {
        loans,
        users: usersWithDates
      }
    }
  } catch (error) {
    console.error('Error fetching loans:', error)
    return {
      props: {
        loans: [],
        users: []
      }
    }
  }
}
