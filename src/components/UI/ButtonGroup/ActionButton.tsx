import React from 'react'

interface ActionButtonProps {
  icon?: React.ReactNode
  label: string
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
  <button
    className={className}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export default ActionButton
