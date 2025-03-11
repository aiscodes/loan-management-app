import React from 'react'
import Layout from '../components/Layout/MainPage'
import Head from 'next/head'

const Account = () => {
  return (
    <>
      <Head>
        <title>Your account</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Layout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-semibold">Account Page</h1>
        </div>
      </Layout>
    </>
  )
}

export default Account
