import React from 'react'
import NextLink, { LinkProps } from 'next/link'

const Link: React.FC<LinkProps & React.HTMLProps<HTMLAnchorElement>> = ({
  as,
  href,
  replace,
  scroll,
  shallow,
  passHref,
  ...rest
}) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink)
    return (
      <NextLink
        as={as}
        href={href}
        passHref={passHref}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
      >
        <a {...rest} />
      </NextLink>
    )

  if (isAnchorLink) return <a href={href} {...rest} />

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default Link
