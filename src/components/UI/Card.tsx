import React, { ReactNode } from 'react'
import { Loan } from '../../types'

interface CardProps {
  loan: Loan
  ButtonGroup: ReactNode
}

const Card: React.FC<CardProps> = ({ loan, ButtonGroup }) => {
  return (
    <div className="card">
      <div>
        <div className="flex-row">
          <p className="text-darkPrimary font-bold">Amount:</p>
          <p>${loan.amount}</p>
        </div>
        <div className="flex-row">
          <p className="text-darkPrimary font-bold">Interest:</p>
          <p>{parseFloat(loan?.interest.toFixed(2))}%</p>
        </div>
        <div className="flex-row">
          <p className="text-darkPrimary font-bold">Duration:</p>
          <p>{loan.duration} months</p>
        </div>
        <div className="flex-row">
          <p className="text-darkPrimary font-bold">Collateral:</p>
          <p>{loan.collateral}</p>
        </div>
      </div>
      <div className="flex justify-center pt-6">{ButtonGroup}</div>
    </div>
  )
}

export default Card
