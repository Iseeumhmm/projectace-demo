'use client'

import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
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
  FiArrowRight,
  FiBox,
  FiCheck,
  FiCode,
  FiCopy,
  FiFlag,
  FiGrid,
  FiLock,
  FiSearch,
  FiSliders,
  FiSmile,
  FiTerminal,
  FiThumbsUp,
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
import { ChakraLogo, NextjsLogo } from '#components/logos'
import { FallInPlace } from '#components/motion/fall-in-place'
import { Pricing } from '#components/pricing/pricing'
import { Testimonial, Testimonials } from '#components/testimonials'
import { Em } from '#components/typography'
import VideoTracker from '#components/videoTracker'
import faq from '#data/faq'
import pricing from '#data/pricing'
import testimonials from '#data/testimonials'

interface HomeClientProps {
  mediaData: any // Replace with proper type from __generated__
}

/**
 * Client component with all the interactive UI
 */
export const HomeClient: React.FC<HomeClientProps> = ({ mediaData }) => {
  React.useEffect(() => {
    console.log('Media data:', mediaData)
  }, [mediaData])

  return (
    <Box>
      <HeroSection />
      <PromoSection />
      <VideoTracker
        playbackId={'d20c653d1f1b7382f9d41e454ffa5d9e'}
        poster={`https://customer-enmv7t1q1y5wg1ch.cloudflarestream.com/d20c653d1f1b7382f9d41e454ffa5d9e/thumbnails/thumbnail.jpg`}
        customerCode="enmv7t1q1y5wg1ch"
      />
      <HighlightsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
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
            title={
              <FallInPlace>
                Build beautiful
                <Br /> software faster
              </FallInPlace>
            }
            description={
              <FallInPlace delay={0.4} fontWeight="medium">
                Saas UI is a <Em>React component library</Em>
                <Br /> that doesn&apos;t get in your way and helps you <Br />{' '}
                build intuitive SaaS products with speed.
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <HStack pt="4" pb="12" spacing="8">
                <NextjsLogo height="28px" /> <ChakraLogo height="20px" />
              </HStack>

              <ButtonGroup spacing={4} alignItems="center">
                <ButtonLink colorScheme="primary" size="lg" href="/signup">
                  Sign Up
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  href="https://demo.saas-ui.dev"
                  variant="outline"
                  rightIcon={
                    <Icon
                      as={FiArrowRight}
                      sx={{
                        transitionProperty: 'common',
                        transitionDuration: 'normal',
                        '.chakra-button:hover &': {
                          transform: 'translate(5px)',
                        },
                      }}
                    />
                  }
                >
                  View demo
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
              <Box overflow="hidden" height="100%">
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

      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: 'Accessible',
            icon: FiSmile,
            description: 'All components strictly follow WAI-ARIA standards.',
            iconPosition: 'left',
            delay: 0.6,
          },
          {
            title: 'Themable',
            icon: FiSliders,
            description:
              'Fully customize all components to your brand with theme support and style props.',
            iconPosition: 'left',
            delay: 0.8,
          },
          {
            title: 'Composable',
            icon: FiGrid,
            description:
              'Compose components to fit your needs and mix them together to create new ones.',
            iconPosition: 'left',
            delay: 1,
          },
          {
            title: 'Productive',
            icon: FiThumbsUp,
            description:
              'Designed to reduce boilerplate and fully typed, build your product at speed.',
            iconPosition: 'left',
            delay: 1.1,
          },
        ]}
        reveal={FallInPlace}
      />
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
      <HighlightsItem colSpan={[1, null, 2]} title="Core components">
        <VStack alignItems="flex-start" spacing="8">
          <Text color="muted" fontSize="xl">
            Get started for free with <Em>30+ open source components</Em>.
            Including authentication screens with Clerk, Supabase and Magic.
            Fully functional forms with React Hook Form. Data tables with React
            Table.
          </Text>

          <Flex
            rounded="full"
            borderWidth="1px"
            flexDirection="row"
            alignItems="center"
            py="1"
            ps="8"
            pe="2"
            bg="primary.900"
            _dark={{ bg: 'gray.900' }}
          >
            <Box>
              <Text color="yellow.400" display="inline">
                yarn add
              </Text>{' '}
              <Text color="cyan.300" display="inline">
                @saas-ui/react
              </Text>
            </Box>
            <IconButton
              icon={hasCopied ? <FiCheck /> : <FiCopy />}
              aria-label="Copy install command"
              onClick={onCopy}
              variant="ghost"
              ms="4"
              isRound
              color="white"
            />
          </Flex>
        </VStack>
      </HighlightsItem>
      <HighlightsItem title="Solid foundations">
        <Text color="muted" fontSize="lg">
          We don&apos;t like to re-invent the wheel, neither should you. We
          selected the most productive and established tools in the scene and
          build Saas UI on top of it.
        </Text>
      </HighlightsItem>
      <HighlightsTestimonialItem
        name="Renata Alink"
        description="Founder"
        avatar="/static/images/avatar.jpg"
        gradient={['pink.200', 'purple.500']}
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

const PricingSection = () => {
  return (
    <Pricing {...pricing}>
      <Text p="8" textAlign="center" color="muted">
        VAT may be applicable depending on your location.
      </Text>
    </Pricing>
  )
}

const FaqSection = () => {
  return <Faq {...faq} />
}
