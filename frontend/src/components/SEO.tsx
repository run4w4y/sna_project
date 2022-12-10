import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import siteMetadata from '@/data/siteMetadata'

interface CommonSEOProps {
  title: string
  description?: string
  ogType: string
  canonicalUrl?: string
}

export const CommonSEO: React.FC<CommonSEOProps> = ({
  title,
  description,
  ogType,
  canonicalUrl,
}) => {
  const router = useRouter()

  return (
    <Head>
      <title> {title} </title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:description" content={description} />
      <link
        rel="canonical"
        href={canonicalUrl ? canonicalUrl : `${siteMetadata.siteUrl}${router.asPath}`}
      />
    </Head>
  )
}

interface PageSEOProps {
  title: string
  description?: string
}

export const PageSEO: React.FC<PageSEOProps> = ({ title, description }) => {
  return <CommonSEO title={title} description={description} ogType="website" />
}
