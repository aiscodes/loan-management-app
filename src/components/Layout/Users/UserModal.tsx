import { forwardRef, useImperativeHandle, useState } from 'react'
import { ModalHandles, User } from '../../../types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Box, Typography } from '@mui/material'

interface UserModalProps {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<any[]>>
}

const UserModal = forwardRef<ModalHandles, UserModalProps>(
  ({ users, setUsers }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isBorrower, setIsBorrower] = useState(false)
    const [isLender, setIsLender] = useState(false)

    const openModal = () => setIsOpen(true)

    const closeModal = () => setIsOpen(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const newUser = {
        name,
        email,
        isBorrower,
        isLender
      }

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMessage = errorData.message || 'Failed to create user'
          throw new Error(errorMessage)
        }

        const createdUser = await response.json()
        setUsers([...users, createdUser])
        closeModal()
        toast.success('User created successfully!')
      } catch (error: any) {
        console.error('Error creating user:', error.message)
        toast.error(`Error: ${error.message || 'Failed to create user'}`)
      }
    }

    useImperativeHandle(ref, () => ({
      openModal,
      closeModal
    }))

    if (!isOpen) return null

    return (
      <Box className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Box className="w-96 rounded-lg bg-white p-6">
          <Typography className="mb-4 text-xl font-semibold">
            Create New User
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Box>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Box>
            <Box>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>
            <Box>
              <label className="block text-sm font-medium text-gray-700">
                Roles
              </label>
              <Box className="flex items-center space-x-4">
                <Box>
                  <input
                    type="checkbox"
                    id="isBorrower"
                    checked={isBorrower}
                    onChange={() => setIsBorrower(!isBorrower)}
                  />
                  <label htmlFor="isBorrower" className="ml-2 text-sm">
                    Borrower
                  </label>
                </Box>
                <Box>
                  <input
                    type="checkbox"
                    id="isLender"
                    checked={isLender}
                    onChange={() => setIsLender(!isLender)}
                  />
                  <label htmlFor="isLender" className="ml-2 text-sm">
                    Lender
                  </label>
                </Box>
              </Box>
            </Box>
            <button
              type="submit"
              className="w-full rounded-md bg-darkPrimary py-2 text-white"
            >
              Create User
            </button>
          </form>
          <button onClick={closeModal} className="btn-secondary mt-4 w-full">
            Close
          </button>
        </Box>
      </Box>
    )
  }
)

UserModal.displayName = 'UserModal'

export default UserModal
