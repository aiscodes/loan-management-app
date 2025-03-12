import { ReactNode } from 'react'
import Logo from '../../../assets/logo.svg'
import Header from './Header'

interface MainPageProps {
  children: ReactNode
  title?: string
  additionalText?: string
}

const MainPage = ({ children, additionalText }: MainPageProps) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full">
          <div className="fade-in mb-6 text-center">
            <Logo className="mx-auto mb-4 h-12 w-12 fill-current dark:text-darkPrimary" />
            <h1 className="heading-primary">Manage Loans with Ease</h1>
            <h2 className="heading-secondary">
              Track and optimize loans effortlessly.
            </h2>
          </div>
          {additionalText && (
            <p className="heading-secondary">{additionalText}</p>
          )}
          <div className="mt-8 w-full">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default MainPage
