import React from 'react'
import { User } from '../../../types'
import { Card, CardContent, Typography, Divider, Box } from '@mui/material'

interface CardProps {
  user: User
}

const UserCard: React.FC<CardProps> = ({ user }) => {
  return (
    <Card className="w-full max-w-lg rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          className="font-semibold text-darkPrimary"
        >
          User Details
        </Typography>
        <Divider className="my-4 bg-gray-300" />
        <Box className="space-y-4">
          <Box className="flex justify-between">
            <Typography className="font-bold text-darkPrimary">
              Name:
            </Typography>
            <Typography className="font-medium text-gray-800">
              {user.name}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography className="font-bold text-darkPrimary">
              Email:
            </Typography>
            <Typography className="font-medium text-gray-800">
              {user.email}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography className="font-bold text-darkPrimary">
              Role:
            </Typography>
            <Typography className="font-medium text-gray-800">
              {user.isBorrower ? 'Borrower' : 'Lender'}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography className="font-bold text-darkPrimary">
              Created At:
            </Typography>
            <Typography className="font-medium text-gray-800">
              {new Date(user.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography className="font-bold text-darkPrimary">
              Updated At:
            </Typography>
            <Typography className="font-medium text-gray-800">
              {new Date(user.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserCard
