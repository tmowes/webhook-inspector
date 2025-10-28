import { type ComponentProps, useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { twMerge } from 'tailwind-merge'

type CodeBlockProps = ComponentProps<'div'> & {
  code: string
  language?: string
}

export function CodeBlock(props: CodeBlockProps) {
  const { className, code, language = 'json', ...rest } = props
  const [parsedCode, setParsedCode] = useState('')

  useEffect(() => {
    if (code) {
      codeToHtml(code, { lang: language, theme: 'github-dark-default' }).then((parsed) =>
        setParsedCode(parsed),
      )
    }
  }, [code, language])

  return (
    <div
      className={twMerge(
        'relative overflow-x-auto rounded-lg border border-zinc-700',
        className,
      )}
      {...rest}
    >
      <div
        className="[&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <shiki>
        dangerouslySetInnerHTML={{ __html: parsedCode }}
      />
    </div>
  )
}
