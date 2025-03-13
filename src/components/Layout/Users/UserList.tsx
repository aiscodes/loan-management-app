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
    <Box className="list-grid">
      {users.map((user) => (
        <Card key={user.id} user={user} />
      ))}
    </Box>
  )
}

export default UserList
