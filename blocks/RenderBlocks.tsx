import { Fragment } from 'react'

import {Faq} from '@/components/faq'

const CoreBlocks = {
  Faq,
}

type BlockComponent = React.ComponentType<any>

const allBlocks: Record<string, BlockComponent> = {
  ...CoreBlocks,
}


const getComponentName = (blockType: string): string => {
  const pascal = blockType.charAt(0).toUpperCase() + blockType.slice(1)
  return pascal.endsWith('Block') ? pascal : `${pascal}Block`
}


export interface RenderBlocksProps {
  blocks: any[]
  reviewOperatorId?: string
}
export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks?.length) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        // Skip if blockType is missing
        if (!blockType) {
          console.warn(`Block at index ${index} is missing blockType`)
          return null
        }

        // Get expected component name
        const componentName = getComponentName(blockType)
        const Block = allBlocks[componentName]

        // Skip rendering if component not found
        if (!Block) {
          console.warn(
            `Block component "${componentName}" not found for blockType "${blockType}". `,
          )
          return null
        }

        // Add common props to all blocks
        let blockWithProps = {
          ...block,
          disableInnerContainer: true,
        }

        return (
          <div
            className="my-24"
            key={block.id || `block-${index}-${blockType}`}
            role="region"
            aria-label={`Content block: ${blockType}`}
          >
            <Block {...blockWithProps} />
          </div>
        )
      })}
    </Fragment>
  )
}
