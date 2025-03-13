import React from 'react'
import Layout from '../components/Layout/MainPage'
import Head from 'next/head'
import { Box, Typography } from '@mui/material'

const Settings = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Layout>
        <Box className="container mx-auto p-6">
          <Typography className="text-2xl font-semibold">
            Settings Page
          </Typography>
        </Box>
      </Layout>
    </>
  )
}

export default Settings
