import React from 'react'
import { User } from '../../../types'
import Card from './UserCard'
import { Box, Typography } from '@mui/material'

interface UserListProps {
  users: User[]
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  if (users.length === 0) {
    return (
      <Typography className="my-8 text-center">
        No users available at the moment.
      </Typography>
    )
  }

  return (
    <Box className="grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id} user={user} />
      ))}
    </Box>
  )
}

export default UserList
