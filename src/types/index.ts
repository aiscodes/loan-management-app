export type LoanStatus = 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED'

export interface Loan {
  id: string
  amount: number
  interest: number
  duration: number
  collateral: string
  status: LoanStatus
  lenderId: string
  borrowerId: string
  createdAt?: number
  updatedAt?: number
  deletedAt?: number | null
  borrower: User
  lender: User
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: number
  updatedAt: number
  isBorrower: boolean
  isLender: boolean
  borrowers?: Loan[]
  loans?: Loan[]
}

export interface ModalHandles {
  openModal: () => void
  closeModal?: () => void
  openEditModal?: (loan: Loan) => void // Если нужно только в LoanModal, можно оставить опциональным
}
