const logMessage = (
  level: 'LOG' | 'WARN' | 'ERROR',
  message: string,
  data?: any
) => {
  const timestamp = new Date().toISOString()
  const formattedMessage = `[${level}] [${timestamp}] ${message}`

  if (level === 'LOG') {
    console.log(
      `%c${formattedMessage}`,
      'color: green; font-weight: bold;',
      data || ''
    )
  } else if (level === 'WARN') {
    console.warn(
      `%c${formattedMessage}`,
      'color: orange; font-weight: bold;',
      data || ''
    )
  } else if (level === 'ERROR') {
    console.error(
      `%c${formattedMessage}`,
      'color: red; font-weight: bold;',
      data || ''
    )
  }
}

const logger = {
  log: (message: string, data?: any) => logMessage('LOG', message, data),
  warn: (message: string, data?: any) => logMessage('WARN', message, data),
  error: (message: string, data?: any) => logMessage('ERROR', message, data)
}

export default logger
