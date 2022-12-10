import Head from 'next/head'
import { AppProps } from 'next/app'
import '@/styles/index.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title> Tasks example </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
