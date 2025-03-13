import React, { ReactNode, useEffect } from 'react'
import { Loan } from '../../../types'
import { Card, CardContent, Typography, Divider, Box } from '@mui/material'
import { getStatusColor } from '../../../utils/color'

interface CardProps {
  loan: Loan
  ButtonGroup: ReactNode
}

const LoanCard: React.FC<CardProps> = ({ loan, ButtonGroup }) => {
  useEffect(() => {
    console.log('Current loan status:', loan.status)
  }, [loan.status])

  const statusColor = getStatusColor(loan.status)

  return (
    <Card className="w-full max-w-full rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          className="font-semibold text-primary"
        >
          Loan Details
        </Typography>
        <Divider className="my-4 bg-gray-300" />
        <Box className="grid grid-cols-2 gap-2">
          <Box className="card-flex">
            <Typography variant="body2" color="text.secondary">
              Amount:
            </Typography>
            <Typography variant="body1" className="font-medium text-green-500">
              ${loan.amount}
            </Typography>
          </Box>
          <Box className="card-flex">
            <Typography variant="body2" color="text.secondary">
              Interest:
            </Typography>
            <Typography variant="body1" className="font-medium text-red-500">
              {parseFloat(loan?.interest.toFixed(2))}%
            </Typography>
          </Box>
          <Box className="card-flex">
            <Typography variant="body2" color="text.secondary">
              Duration:
            </Typography>
            <Typography variant="body1" className="font-medium text-orange-500">
              {loan.duration} months
            </Typography>
          </Box>
          <Box className="card-flex">
            <Typography variant="body2" color="text.secondary">
              Collateral:
            </Typography>
            <Typography variant="body1" className="font-medium text-primary">
              {loan.collateral}
            </Typography>
          </Box>
        </Box>

        <Divider className="my-2 bg-gray-300" />

        <Typography
          variant="body1"
          className="mt-2 font-semibold"
          style={{ color: statusColor }}
        >
          Status: {loan.status}
        </Typography>

        <Box className="mt-2 flex justify-center">{ButtonGroup}</Box>
      </CardContent>
    </Card>
  )
}

export default LoanCard
