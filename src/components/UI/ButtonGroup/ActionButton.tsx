import { Button } from '@mui/material'
import React from 'react'

interface ActionButtonProps {
  icon?: React.ReactNode
  label?: string
  onClick: () => void
  disabled?: boolean
  ariaLabel: string
  className?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  ariaLabel,
  className
}) => (
  <Button
    className={className}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    {icon}
    {label && <span>{label}</span>}
  </Button>
)

export default ActionButton
