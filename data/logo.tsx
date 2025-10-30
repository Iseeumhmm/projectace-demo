import { HTMLChakraProps, chakra, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'

export const Logo: React.FC<HTMLChakraProps<'svg'>> = (props) => {
  const color = useColorModeValue('#231f20', '#fff')
  return (
    <Image
      src="/static/logo.png"
      alt="Project Ace"
      width={150}
      height={50}
      style={{ marginTop: '-1.25rem' }}
    />
  )
}
