import React from 'react'
import Layout from '../components/Layout/MainPage'
import Head from 'next/head'
import { Box, Typography } from '@mui/material'

const Account = () => {
  return (
    <>
      <Head>
        <title>Your account</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Layout>
        <Box className="container mx-auto p-6">
          <Typography className="text-2xl font-semibold">
            Account Page
          </Typography>
        </Box>
      </Layout>
    </>
  )
}

export default Account
