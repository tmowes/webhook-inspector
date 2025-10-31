import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { webhookListSchema } from '@/http/schemas/webhooks'
import { Button } from '../ui/button'
import { WebhooksListItem } from './list-item'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)

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
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
      },
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

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 left-0 z-40 flex h-12 items-center border-zinc-700 border-b bg-zinc-800/30 backdrop-blur-sm">
        <Button className="mx-auto">Gerar orquestrador</Button>
      </div>
      <div className="relative flex-1 overflow-y-auto">
        <div className="space-y-1 p-2 pt-16">
          {webhooks.map((webhook) => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                onWebhookChecked={onWebhookChecked}
                checked={isCheckedIds.includes(webhook.id)}
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
    </div>
  )
}
