import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2, Wand2 } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useEffect, useRef, useState } from 'react'

import { webhookListSchema } from '@/http/schemas/webhooks'
import { CodeBlock } from '../ui/code-block'
import { WebhooksListItem } from './list-item'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<string | null>(null)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['webhooks'],
    queryFn: async ({ pageParam }) => {
      const url = new URL('http://localhost:3333/api/webhooks')
      if (pageParam) {
        url.searchParams.set('cursor', pageParam)
      }
      const response = await fetch(url)
      const result = await response.json()
      return webhookListSchema.parse(result)
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined
    },
    initialPageParam: undefined as string | undefined,
  })

  const webhooks = data.pages.flatMap((page) => page.webhooks)

  const [isCheckedIds, setIsCheckedIds] = useState<string[]>([])

  function onWebhookChecked(id: string, checked: boolean) {
    setIsCheckedIds((prev) => {
      if (checked) {
        return [...prev, id]
      }
      return prev.filter((checkedId) => checkedId !== id)
    })
  }

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const onCheckedChange = (checkedWebhookId: string) => {
    if (checkedIds.includes(checkedWebhookId)) {
      setCheckedIds((state) => {
        return state.filter((webhookId) => webhookId !== checkedWebhookId)
      })
    } else {
      setCheckedIds((state) => [...state, checkedWebhookId])
    }
  }


  const onGenerateHandler = async () => {
    const response = await fetch('http://localhost:3333/api/generate', {
      method: 'POST',
      body: JSON.stringify({ webhookIds: checkedIds }),
      headers: { 'Content-Type': 'application/json' },
    })
    type GenerateResponse = { code: string }
    const result: GenerateResponse = await response.json()
    setGeneratedHandlerCode(result.code)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          <button
            type="button"
            onClick={() => onGenerateHandler()}
            disabled={!(checkedIds.length > 0)}
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-lg bg-indigo-400 py-2 font-medium text-sm text-white disabled:opacity-50"
          >
            <Wand2 className="size-4" />
            Gerar Orquestrador
          </button>

          {webhooks.map((webhook) => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                isChecked={checkedIds.includes(webhook.id)}
                onCheckedChange={onCheckedChange}
              />
            )
          })}
        </div>
        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-5 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generatedHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className='fixed inset-0 z-20 bg-black/60' />
          <Dialog.Content className='-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 flex max-h-[85vh] w-[90vw] items-center justify-center'>
            <div className='max-h-[620px] w-[600px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4'>
              <CodeBlock language="typescript" code={generatedHandlerCode} />
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  )
}
