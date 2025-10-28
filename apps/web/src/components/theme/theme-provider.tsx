import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}

// biome-ignore lint/performance/noBarrelFile: <next-themes hook>
export { useTheme } from 'next-themes'
