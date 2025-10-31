'use client'

import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Heading,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  useClipboard,
} from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react'
import Image from 'next/image'
import {
  FiBox,
  FiCode,
  FiFlag,
  FiLock,
  FiSearch,
  FiTerminal,
  FiToggleLeft,
  FiTrendingUp,
  FiUserPlus,
} from 'react-icons/fi'

import * as React from 'react'

import { ButtonLink } from '#components/button-link/button-link'
import { Faq } from '#components/faq'
import { Features } from '#components/features'
import { BackgroundGradient } from '#components/gradients/background-gradient'
import { Hero } from '#components/hero'
import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from '#components/highlights'
import { NextjsLogo } from '#components/logos'
import { CloudflareLogo } from '#components/logos/cloudflare'
import { PayloadLogo } from '#components/logos/payload'
import { FallInPlace } from '#components/motion/fall-in-place'
import { Pricing, type PricingProps } from '#components/pricing/pricing'
import { Testimonial, Testimonials } from '#components/testimonials'
import VideoTracker from '#components/videoTracker'
import faq from '#data/faq'
import pricing from '#data/pricing'
import testimonials from '#data/testimonials'

type FaqData = {
  title?: React.ReactNode
  description?: React.ReactNode
  items: { q: React.ReactNode; a: React.ReactNode }[]
}

type DynamicSection =
  | { kind: 'video'; playbackId: string }
  | { kind: 'pricing'; data: Omit<PricingProps, 'children'> }
  | { kind: 'faq'; data: FaqData }
  | { kind: 'content'; nodes: any[] }

interface HomeClientProps {
  videoPlaybackId?: string
  pricing?: Omit<PricingProps, 'children'>
  faq?: FaqData
  /**
   * Lexical rich text root children from the CMS ContentBlock
   */
  contentNodes?: any[]
  /**
   * Ordered dynamic sections from CMS layout
   */
  blocks?: DynamicSection[]
}

/**
 * Client component with all the interactive UI
 */
export const HomeClient: React.FC<HomeClientProps> = ({
  videoPlaybackId,
  pricing: pricingOverride,
  faq: faqOverride,
  contentNodes,
  blocks,
}) => {
  return (
    <Box>
      <HeroSection />
      {/* <PromoSection /> */}
      {Array.isArray(blocks) && blocks.length > 0 ? (
        <>
          {blocks.map((section, index) => {
            switch (section.kind) {
              case 'video':
                return (
                  <VideoTracker
                    key={`video-${index}`}
                    playbackId={section.playbackId}
                  />
                )
              case 'pricing':
                return (
                  <PricingSection
                    key={`pricing-${index}`}
                    data={section.data}
                  />
                )
              case 'faq':
                return <FaqSection key={`faq-${index}`} data={section.data} />
              case 'content':
                return (
                  <ContentSection
                    key={`content-${index}`}
                    nodes={section.nodes}
                  />
                )
              default:
                return null
            }
          })}
        </>
      ) : (
        <>
          <PricingSection data={pricingOverride} />
          <VideoTracker
            playbackId={videoPlaybackId ?? 'd20c653d1f1b7382f9d41e454ffa5d9e'}
            poster={
              videoPlaybackId
                ? undefined
                : `https://customer-enmv7t1q1y5wg1ch.cloudflarestream.com/d20c653d1f1b7382f9d41e454ffa5d9e/thumbnails/thumbnail.jpg`
            }
            customerCode={videoPlaybackId ? undefined : 'enmv7t1q1y5wg1ch'}
          />
          <FaqSection data={faqOverride} />
          {contentNodes?.length ? (
            <ContentSection nodes={contentNodes} />
          ) : null}
        </>
      )}
      <HighlightsSection />
      <FeaturesSection />
      <TestimonialsSection />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" zIndex="-1" />
      <Container maxW="container.xl" pt={{ base: 40, lg: 60 }} pb="40">
        <Stack direction={{ base: 'column', lg: 'row' }} alignItems="center">
          <Hero
            id="home"
            justifyContent="flex-start"
            px="0"
            title={<FallInPlace>The Next Big Thing</FallInPlace>}
          >
            <FallInPlace delay={0.8}>
              <HStack pt="4" pb="12" spacing="8">
                <CloudflareLogo />
                <PayloadLogo />
                <NextjsLogo height="28px" />
              </HStack>

              <ButtonGroup spacing={4} alignItems="center">
                <ButtonLink colorScheme="primary" size="lg" href="/signup">
                  Sign Up
                </ButtonLink>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
          <Box
            height="600px"
            position="absolute"
            display={{ base: 'none', lg: 'block' }}
            left={{ lg: '60%', xl: '55%' }}
            width="80vw"
            maxW="1100px"
            margin="0 auto"
          >
            <FallInPlace delay={1}>
              <Box
                overflow="hidden"
                height="100%"
                style={{ borderRadius: '1rem', border: '1px solid #8952e0' }}
              >
                <Image
                  src="/static/screenshots/hero.png"
                  width={1200}
                  height={762}
                  alt="Project Ace"
                  quality="75"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </FallInPlace>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

const PromoSection: React.FC = () => {
  return (
    <Container maxW="container.xl" py="20">
      <Box
        position="relative"
        bg="#311361"
        borderRadius="2xl"
        maxW="960px"
        mx="auto"
        overflow="hidden"
      >
        {/* Checkered Pattern Background */}
        <Box
          position="absolute"
          bottom="0"
          left="50%"
          transform="translateX(-50%)"
          width="640px"
          height="640px"
          opacity={0.15}
          pointerEvents="none"
          backgroundImage="url(/static/promo/checkered-pattern.svg)"
          backgroundSize="cover"
          backgroundPosition="center"
        />

        {/* Glitters */}
        <Box
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -40%)"
          width="480px"
          height="288px"
          pointerEvents="none"
          zIndex={0}
          backgroundImage="url(/static/promo/glitters.svg)"
          backgroundSize="cover"
        />

        <VStack spacing={0} pt={[8, 10, 10]} pb={[16, 20, 24]} px={4}>
          {/* Logo */}
          <Box mb={[6, 8, 10]} zIndex={1}>
            <Image
              src="/static/promo/logo.svg"
              alt="Landify"
              width={192}
              height={48}
            />
          </Box>

          {/* Heading */}
          <VStack spacing={2} mb={[6, 8, 10]} zIndex={1}>
            <Text
              color="white"
              fontSize={['md', 'lg', 'xl']}
              fontWeight="500"
              textTransform="uppercase"
              textAlign="center"
              letterSpacing="wide"
            >
              Get the full version at
            </Text>
            <Heading
              color="white"
              fontSize={['3xl', '4xl', '5xl', '6xl']}
              fontWeight="700"
              textAlign="center"
              textShadow="4px 4px 4px rgba(0, 0, 0, 0.3)"
            >
              15% off!
            </Heading>
          </VStack>

          {/* Discount Code Box */}
          <Box
            bg="#4C1D95"
            border="2px dashed #7C3AED"
            borderRadius="xl"
            px={[6, 8, 10]}
            py={[4, 5, 6]}
            boxShadow="0px 8px 40px 0px rgba(0, 0, 0, 0.25)"
            mb={[6, 8, 10]}
            zIndex={1}
          >
            <Text
              color="white"
              fontSize={['xl', '2xl', '3xl', '4xl']}
              fontWeight="600"
              letterSpacing="0.08em"
              textAlign="center"
            >
              FIGMACOMMUNITY
            </Text>
          </Box>

          {/* Description */}
          <Text
            color="white"
            fontSize={['sm', 'md', 'lg']}
            textAlign="center"
            maxW="428px"
            mb={[8, 10, 12]}
            lineHeight="1.5"
            zIndex={1}
          >
            Upgrade to the PRO version of Landify UI kit with the above discount
            code.
          </Text>

          {/* Claim Now Button */}
          <Box
            as="a"
            href="#"
            position="relative"
            display="inline-block"
            cursor="pointer"
            zIndex={1}
            transition="transform 0.2s"
            _hover={{
              transform: 'translateY(-2px)',
            }}
          >
            <Box
              position="relative"
              width={['400px', '470px', '564px']}
              height={['80px', '100px', '120px']}
            >
              {/* Button Background SVG */}
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                backgroundImage="url(/static/promo/button-bg.svg)"
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                backgroundPosition="center"
              />

              {/* Button Bottom Decoration */}
              <Box
                position="absolute"
                bottom="0"
                left="50%"
                transform="translateX(-50%)"
                width="93%"
                height="20%"
                backgroundImage="url(/static/promo/button-bottom.svg)"
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                backgroundPosition="center"
              />

              {/* Button Label */}
              <Flex
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="83%"
                alignItems="center"
                justifyContent="center"
                gap={3}
              >
                <Text
                  color="black"
                  fontSize={['xl', '2xl', '28px']}
                  fontWeight="600"
                  lineHeight="1.3"
                >
                  Claim now
                </Text>
                <Box
                  width={['20px', '22px', '24px']}
                  height={['13px', '14px', '16px']}
                  backgroundImage="url(/static/promo/arrow-icon.svg)"
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  backgroundPosition="center"
                  mt={1}
                />
              </Flex>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}

const HighlightsSection = () => {
  const { onCopy, hasCopied } = useClipboard('yarn add @saas-ui/react')

  return (
    <Highlights>
      <HighlightsTestimonialItem
        name="Renata Alink"
        description="Founder"
        avatar="/static/images/avatar.jpg"
        bg="purple.900"
        gradient={['pink.900', 'purple.900']}
      >
        "Saas UI helped us set up a beautiful modern UI in no time. It saved us
        hundreds of hours in development time and allowed us to focus on
        business logic for our specific use-case from the start."
      </HighlightsTestimonialItem>
      <HighlightsItem
        colSpan={[1, null, 2]}
        title="Start your next idea two steps ahead"
      >
        <Text color="muted" fontSize="lg">
          We took care of all your basic frontend needs, so you can start
          building functionality that makes your product unique.
        </Text>
        <Wrap mt="8">
          {[
            'authentication',
            'navigation',
            'crud',
            'settings',
            'multi-tenancy',
            'layouts',
            'billing',
            'a11y testing',
            'server-side rendering',
            'documentation',
            'onboarding',
            'storybooks',
            'theming',
            'upselling',
            'unit testing',
            'feature flags',
            'responsiveness',
          ].map((value) => (
            <Tag
              key={value}
              variant="subtle"
              colorScheme="purple"
              rounded="full"
              px="3"
            >
              {value}
            </Tag>
          ))}
        </Wrap>
      </HighlightsItem>
    </Highlights>
  )
}

const FeaturesSection = () => {
  return (
    <Features
      id="features"
      title={
        <Heading
          lineHeight="short"
          fontSize={['2xl', null, '4xl']}
          textAlign="left"
          as="p"
        >
          Not your standard
          <Br /> dashboard template.
        </Heading>
      }
      description={
        <>
          Saas UI Pro includes everything you need to build modern frontends.
          <Br />
          Use it as a template for your next product or foundation for your
          design system.
        </>
      }
      align="left"
      columns={[1, 2, 3]}
      iconSize={4}
      features={[
        {
          title: '#components.',
          icon: FiBox,
          description:
            'All premium components are available on a private NPM registery, no more copy pasting and always up-to-date.',
          variant: 'inline',
        },
        {
          title: 'Starterkits.',
          icon: FiLock,
          description:
            'Example apps in Next.JS, Electron. Including authentication, billing, example pages, everything you need to get started FAST.',
          variant: 'inline',
        },
        {
          title: 'Documentation.',
          icon: FiSearch,
          description:
            'Extensively documented, including storybooks, best practices, use-cases and examples.',
          variant: 'inline',
        },
        {
          title: 'Onboarding.',
          icon: FiUserPlus,
          description:
            'Add user onboarding flows, like tours, hints and inline documentation without breaking a sweat.',
          variant: 'inline',
        },
        {
          title: 'Feature flags.',
          icon: FiFlag,
          description:
            "Implement feature toggles for your billing plans with easy to use hooks. Connect Flagsmith, or other remote config services once you're ready.",
          variant: 'inline',
        },
        {
          title: 'Upselling.',
          icon: FiTrendingUp,
          description:
            '#components and hooks for upgrade flows designed to make upgrading inside your app frictionless.',
          variant: 'inline',
        },
        {
          title: 'Themes.',
          icon: FiToggleLeft,
          description:
            'Includes multiple themes with darkmode support, always have the perfect starting point for your next project.',
          variant: 'inline',
        },
        {
          title: 'Generators.',
          icon: FiTerminal,
          description:
            'Extend your design system while maintaininig code quality and consistency with built-in generators.',
          variant: 'inline',
        },
        {
          title: 'Monorepo.',
          icon: FiCode,
          description: (
            <>
              All code is available as packages in a high-performance{' '}
              <Link href="https://turborepo.com">Turborepo</Link>, you have full
              control to modify and adjust it to your workflow.
            </>
          ),
          variant: 'inline',
        },
      ]}
    />
  )
}

const TestimonialsSection = () => {
  const columns = React.useMemo(() => {
    return testimonials.items.reduce<Array<typeof testimonials.items>>(
      (columns, t, i) => {
        columns[i % 3].push(t)

        return columns
      },
      [[], [], []],
    )
  }, [])

  return (
    <Testimonials
      title={testimonials.title}
      columns={[1, 2, 3]}
      innerWidth="container.xl"
    >
      <>
        {columns.map((column, i) => (
          <Stack key={i} spacing="8">
            {column.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
          </Stack>
        ))}
      </>
    </Testimonials>
  )
}

const PricingSection: React.FC<{ data?: Omit<PricingProps, 'children'> }> = ({
  data,
}) => {
  return (
    <Pricing {...(data ?? pricing)}>
      <Text p="8" textAlign="center" color="muted">
        VAT may be applicable depending on your location.
      </Text>
    </Pricing>
  )
}

const FaqSection: React.FC<{ data?: FaqData }> = ({ data }) => {
  return <Faq {...(data ?? faq)} />
}

/**
 * Render a simple subset of Lexical nodes coming from the CMS
 */
function ContentSection({ nodes }: { nodes: any[] }) {
  const renderInline = (children: any[]) =>
    (children || []).map((c, i) =>
      c?.type === 'linebreak' ? (
        <Br key={`br-${i}`} />
      ) : (
        <React.Fragment key={`t-${i}`}>{c?.text ?? ''}</React.Fragment>
      ),
    )

  return (
    <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
      <Stack spacing={4} px={{ base: 4, md: 0 }}>
        {nodes.map((n: any, i: number) => {
          if (n?.type === 'heading') {
            const tag = (n?.tag as any) || 'h2'
            const align = (n?.format as any) || 'left'
            // Lexical heading stores paragraph children inside the first child
            const inlineChildren = n?.children?.[0]?.children || []
            return (
              <Heading key={i} as={tag as any} textAlign={align as any}>
                {renderInline(inlineChildren)}
              </Heading>
            )
          }
          if (n?.type === 'paragraph') {
            const align = (n?.format as any) || 'left'
            return (
              <Text key={i} textAlign={align as any}>
                {renderInline(n?.children || [])}
              </Text>
            )
          }
          return null
        })}
      </Stack>
    </Container>
  )
}
