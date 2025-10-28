import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function SectionTitle(props: ComponentProps<'h3'>) {
  const { className, ...rest } = props
  return (
    <h3 className={twMerge('font-semibold text-base text-zinc-100', className)} {...rest} />
  )
}
