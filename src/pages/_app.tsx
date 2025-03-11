import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} position="bottom-right" />
    </>
  )
}

export default MyApp
