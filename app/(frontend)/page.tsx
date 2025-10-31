import { graphql } from '@/__generated__'
import { getAuthToken } from '@/lib/auth'
import { gqlFetch } from '@/lib/gql'

import { HomeClient } from '#components/home-client'

export default async function Page() {
  const MediaQuery = graphql(`
    query HomePage {
      Pages(where: { title: { equals: "Home Page" } }) {
        docs {
          id
          title
          slug
          layout {
            ... on VideoBlock {
              CloudflareStreamVideo {
                title
                streamVideoId
              }
            }
            ... on FAQBlock {
              id
              blockName
              blockType
              title
              faqs {
                id
                question
                answer
              }
            }

            ... on Cta {
              title
              description
              cards {
                title
                description
                features {
                  feature
                }
                featured
                buttonText
                featured
              }
            }
            ... on ContentBlock {
              richText
            }
          }
          authors {
            ... on Author {
              displayName
              authorTitle
              profilePicture {
                width
                height
                url
              }
            }
          }
          createdAt
          updatedAt
        }
        totalDocs
        hasNextPage
      }
    }
  `)

  const token = await getAuthToken()
  const data = await gqlFetch(
    MediaQuery,
    { limit: 20 },
    { revalidate: 60, token },
  )

  // Helpers to extract content from blocks
  const page = (data as any)?.Pages?.docs?.[0]
  const layout = page?.layout ?? []

  // Video: pick first VideoBlock
  const videoPlaybackId: string | undefined = layout
    .map((b: any) => b?.CloudflareStreamVideo?.streamVideoId)
    .find(Boolean)

  // CTA -> Pricing plans mapping
  const ctaBlock: any | undefined = layout.find((b: any) =>
    Array.isArray(b?.cards),
  )

  const pricing = ctaBlock
    ? {
        title: ctaBlock?.title ?? 'Top picks',
        description:
          ctaBlock?.description ??
          'Curated recommendations powered by CMS content.',
        plans: (ctaBlock.cards as any[]).map((card: any, idx: number) => {
          const slug = String(card?.title || `plan-${idx}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')

          return {
            id: `${idx}-${slug}`,
            title: card?.title ?? '',
            description: card?.description ?? '',
            price: '',
            features: Array.isArray(card?.features)
              ? card.features.map((f: any) => ({ title: f?.feature }))
              : [],
            action: { href: '#', label: card?.buttonText || 'Learn more' },
            isRecommended: Boolean(card?.featured),
          }
        }),
      }
    : undefined

  // FAQ mapping (flatten Lexical rich text -> plain text)
  const flattenLexicalToText = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    const children: any[] = node?.children || node?.root?.children || []
    let out = ''
    for (const child of children) {
      if (child?.text) out += child.text
      if (child?.children?.length) out += flattenLexicalToText(child)
    }
    return out
  }

  const faqBlock: any | undefined = layout.find((b: any) =>
    Array.isArray(b?.faqs),
  )
  const faq = faqBlock
    ? {
        title: faqBlock?.title ?? 'Frequently asked questions',
        items: (faqBlock.faqs as any[]).map((f: any) => ({
          q: f?.question ?? '',
          a: flattenLexicalToText(f?.answer) ?? '',
        })),
      }
    : undefined

  // Content block (richText) mapping
  const contentBlock: any | undefined = layout.find((b: any) => b?.richText)
  const contentNodes: any[] = contentBlock?.richText?.root?.children ?? []

  // Build ordered dynamic blocks based on layout order
  const blocks: Array<
    | { kind: 'video'; playbackId: string }
    | { kind: 'pricing'; data: any }
    | { kind: 'faq'; data: any }
    | { kind: 'content'; nodes: any[] }
  > = []

  for (const b of layout as any[]) {
    const streamId = b?.CloudflareStreamVideo?.streamVideoId
    if (typeof streamId === 'string' && streamId.length > 0) {
      blocks.push({ kind: 'video', playbackId: streamId })
      continue
    }

    if (Array.isArray(b?.cards)) {
      const pricingFromCta = {
        title: b?.title ?? 'Top picks',
        description:
          b?.description ?? 'Curated recommendations powered by CMS content.',
        plans: (b.cards as any[]).map((card: any, idx: number) => {
          const slug = String(card?.title || `plan-${idx}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')

          return {
            id: `${idx}-${slug}`,
            title: card?.title ?? '',
            description: card?.description ?? '',
            price: '',
            features: Array.isArray(card?.features)
              ? card.features.map((f: any) => ({ title: f?.feature }))
              : [],
            action: { href: '#', label: card?.buttonText || 'Learn more' },
            isRecommended: Boolean(card?.featured),
          }
        }),
      }
      blocks.push({ kind: 'pricing', data: pricingFromCta })
      continue
    }

    if (Array.isArray(b?.faqs)) {
      const faqFromBlock = {
        title: b?.title ?? 'Frequently asked questions',
        items: (b.faqs as any[]).map((f: any) => ({
          q: f?.question ?? '',
          a: flattenLexicalToText(f?.answer) ?? '',
        })),
      }
      blocks.push({ kind: 'faq', data: faqFromBlock })
      continue
    }

    if (b?.richText) {
      blocks.push({
        kind: 'content',
        nodes: b?.richText?.root?.children ?? [],
      })
      continue
    }
  }

  return <HomeClient blocks={blocks} />
}
