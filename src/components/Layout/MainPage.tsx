import { ReactNode } from 'react'
import Logo from '../../../assets/logo.svg'
import Header from './Header'
import { Box, Typography } from '@mui/material'

interface MainPageProps {
  children: ReactNode
  title?: string
  additionalText?: string
}

const MainPage = ({ children, additionalText }: MainPageProps) => {
  return (
    <Box className="min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-12">
        <Box className="mx-auto w-full">
          <Box className="fade-in mb-6 text-center">
            <Logo className="mx-auto mb-4 h-12 w-12 fill-current dark:text-darkPrimary" />
            <Typography className="heading-primary">
              Manage Loans with Ease
            </Typography>
            {!additionalText && (
              <Typography className="heading-secondary">
                Track and optimize loans effortlessly.
              </Typography>
            )}
          </Box>
          {additionalText && (
            <Typography className="heading-secondary text-center">
              {additionalText}
            </Typography>
          )}
          <Box className="mt-8 w-full">{children}</Box>
        </Box>
      </main>
    </Box>
  )
}

export default MainPage
