import { useState } from 'react'
import { ModalHandles } from '../../../types'
import { createUser } from '../../../utils'

interface UserModalProps {
  ref: React.Ref<ModalHandles>
  onSuccess: () => void
}

const UserModal = ({ ref, onSuccess }: UserModalProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isBorrower, setIsBorrower] = useState(false)
  const [isLender, setIsLender] = useState(false)
  const [loanData, setLoanData] = useState({
    amount: 0,
    interest: 0,
    duration: 0,
    collateral: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await createUser({
      name,
      email,
      isBorrower,
      isLender,
      loanData: isBorrower ? loanData : undefined
    })

    if (result.success) {
      onSuccess()
      // Закрытие модалки, если создание прошло успешно
      ref.current?.closeModal()
    } else {
      setError(result.error || 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create User</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isBorrower}
                onChange={() => setIsBorrower(!isBorrower)}
              />
              Borrower
            </label>
            <label>
              <input
                type="checkbox"
                checked={isLender}
                onChange={() => setIsLender(!isLender)}
              />
              Lender
            </label>
          </div>

          {isBorrower && (
            <div className="loan-details">
              <h4>Loan Information</h4>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={loanData.amount}
                  onChange={(e) =>
                    setLoanData({ ...loanData, amount: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Interest</label>
                <input
                  type="number"
                  value={loanData.interest}
                  onChange={(e) =>
                    setLoanData({
                      ...loanData,
                      interest: Number(e.target.value)
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (months)</label>
                <input
                  type="number"
                  value={loanData.duration}
                  onChange={(e) =>
                    setLoanData({
                      ...loanData,
                      duration: Number(e.target.value)
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Collateral</label>
                <input
                  type="text"
                  value={loanData.collateral}
                  onChange={(e) =>
                    setLoanData({ ...loanData, collateral: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal
