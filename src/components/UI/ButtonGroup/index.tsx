import React from 'react'
import { FiEdit, FiTrash, FiEye } from 'react-icons/fi'
import { Loan } from '../../../types'
import ActionButton from './ActionButton'
interface ButtonGroupProps {
  loan: Loan
  isDeletingLoan: string | null
  onEditLoan(loan: Loan): void
  onDeleteLoan(id: string): void
  onViewLoan(id: string): void
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  loan,
  isDeletingLoan,
  onEditLoan,
  onDeleteLoan,
  onViewLoan
}) => {
  return (
    <div className="flex gap-4">
      <ActionButton
        icon={<FiEdit size={18} />}
        label="Edit"
        onClick={() => onEditLoan(loan)}
        ariaLabel="Edit Loan"
        className="btn btn-primary px-5 py-2 text-sm"
      />
      <ActionButton
        icon={<FiTrash size={18} />}
        label="Delete"
        onClick={() => onDeleteLoan(loan.id)}
        disabled={isDeletingLoan === loan.id}
        ariaLabel="Delete Loan"
        className="icon-button icon-button-delete px-5 py-2 text-sm"
      />
      <ActionButton
        icon={<FiEye size={18} />}
        label="View"
        onClick={() => onViewLoan(loan.id)}
        ariaLabel="View Loan Details"
        className="icon-button icon-button-view px-5 py-2 text-sm"
      />
    </div>
  )
}

export default ButtonGroup
