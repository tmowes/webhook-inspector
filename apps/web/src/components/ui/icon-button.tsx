import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const iconButton = tv({
  base: 'flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-zinc-700',
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type IconButtonProps = ComponentProps<'button'> &
  VariantProps<typeof iconButton> & {
    icon: ReactNode
  }

export function IconButton(props: IconButtonProps) {
  const { icon, size, className, ...rest } = props
  return (
    <button type="button" className={iconButton({ size, className })} {...rest}>
      {icon}
    </button>
  )
}
