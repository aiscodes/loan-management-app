import Head from 'next/head'
import { useState, useCallback, useRef } from 'react'
import List from '../components/UI/List'
import Modal from '../components/UI/Modal'
import MainPage from '../components/Layout/MainPage'
import { GetServerSideProps } from 'next'
import { getLoans } from '../utils'
import { Loan, ModalHandles } from '../types'
import ActionButton from '../components/UI/ButtonGroup/ActionButton'
import { FiPlus } from 'react-icons/fi'

interface HomeProps {
  loans: Loan[]
}

const Home = ({ loans: storedLoans }: HomeProps) => {
  const [loans, setLoans] = useState<Array<Loan>>(storedLoans)
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
        <List loans={loans} onEditLoan={openEditModal} setLoans={setLoans} />
      </MainPage>
      <Modal loans={loans} setLoans={setLoans} ref={modalRef} />
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
