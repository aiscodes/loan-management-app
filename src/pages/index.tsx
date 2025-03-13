import Head from 'next/head'
import { useState, useCallback, useRef } from 'react'
import MainPage from '../components/Layout/MainPage'
import { GetServerSideProps } from 'next'
import { getLoans, getUsers } from '../utils'
import { Loan, ModalHandles, User } from '../types'
import ActionButton from '../components/UI/ButtonGroup/ActionButton'
import { FiPlus } from 'react-icons/fi'
import LoanList from '../components/Layout/Loans/LoanList'
import LoanModal from '../components/Layout/Loans/LoanModal'
import UserList from '../components/Layout/Users/UserList'
import UserModal from '../components/Layout/Users/UserModal'
import {
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Typography
} from '@mui/material'

interface HomeProps {
  loans: Loan[]
  users: User[]
}

const Home = ({ loans: storedLoans, users: storedUsers }: HomeProps) => {
  const [loans, setLoans] = useState<Array<Loan>>(storedLoans)
  const [users, setUsers] = useState<Array<User>>(storedUsers)
  const [activeTab, setActiveTab] = useState('loans')

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

  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleTabChange = (_: React.ChangeEvent<unknown>, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <Head>
        <title>Loan Tracker</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <MainPage>
        <Box>
          <Box
            className={`flex ${isMobile ? 'w-full flex-col' : 'w-full flex-row'}`}
          >
            {isMobile ? (
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="tabs"
                variant="fullWidth"
              >
                <Tab label="Users" value="users" />
                <Tab label="Loans" value="loans" />
              </Tabs>
            ) : (
              <Box className="flex w-1/4 flex-col">
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
              </Box>
            )}
            <Box className={isMobile ? 'mt-8 w-full' : 'ml-8 w-full'}>
              {activeTab === 'users' && (
                <Box className="space-y-4">
                  <Box className="centred-box">
                    <Typography className="text-xl font-semibold">
                      Users
                    </Typography>
                    <ActionButton
                      icon={<FiPlus size={18} />}
                      className="btn btn-primary"
                      onClick={openUserModal}
                      label="Create a new user"
                      ariaLabel="Create a new user"
                    />
                  </Box>

                  <Box className="rounded-lg bg-gray-200 p-4">
                    <UserList users={users} />
                  </Box>
                </Box>
              )}

              {activeTab === 'loans' && (
                <Box className="space-y-4">
                  <Box className="centred-box">
                    <Typography className="text-xl font-semibold">
                      Loans
                    </Typography>
                    <ActionButton
                      icon={<FiPlus size={18} />}
                      className="btn btn-primary"
                      onClick={openLoanModal}
                      label="Create a new loan"
                      ariaLabel="Create a new loan"
                    />
                  </Box>
                  <Box className="rounded-lg bg-gray-200 p-4">
                    <LoanList
                      loans={loans}
                      onEditLoan={openEditLoanModal}
                      setLoans={setLoans}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </MainPage>

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
