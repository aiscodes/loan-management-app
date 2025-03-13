export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '#b0bec5'
    case 'ACTIVE':
      return '#3f51b5'
    case 'PAID':
      return '#4caf50'
    case 'DEFAULTED':
      return '#d32f2f'
    default:
      return '#b0bec5'
  }
}

export const getRoleColor = (isBorrower: boolean): string => {
  return isBorrower ? '#4CAF50' : '#FF9800'
}
