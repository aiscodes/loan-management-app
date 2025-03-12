import { useState } from 'react'
import Link from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-gradient-to-r from-darkSecondary via-darkPrimary to-darkBg backdrop-blur-md dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-2xl font-semibold text-primary dark:text-white"
            aria-label="Go to homepage"
          >
            LoanTracker
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-gray-700 md:flex dark:text-gray-100">
          <Link
            href="/account"
            className="header-link"
            aria-label="Go to account page"
          >
            Account
          </Link>
          <Link
            href="/settings"
            className="header-link"
            aria-label="Go to settings page"
          >
            Settings
          </Link>
        </nav>

        <button
          onClick={toggleMenu}
          className="burger-btn md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      <nav
        className={`mobile-nav absolute left-0 top-16 w-full overflow-hidden px-6 py-4 shadow-md transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Link
          href="/account"
          className="mobile-link"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Go to account page"
        >
          Account
        </Link>
        <Link
          href="/settings"
          className="mobile-link"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Go to settings page"
        >
          Settings
        </Link>
      </nav>
    </header>
  )
}

export default Header
