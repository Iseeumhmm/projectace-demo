import * as NextSeoModule from 'next-seo'

import React from 'react'

import siteConfig from '#data/config'

const NextSeo = (NextSeoModule as any).default || NextSeoModule

export interface SEOProps {
  title?: string
  description?: string
  openGraph?: any
  twitter?: any
  [key: string]: any
}

export const SEO = ({ title, description, ...props }: SEOProps) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{ ...siteConfig.seo.openGraph, title, description }}
    titleTemplate={siteConfig.seo.titleTemplate}
    twitter={siteConfig.seo.twitter}
    {...props}
  />
)
