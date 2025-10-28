import { Badge } from '../ui/badge'

// type WebhookHeaderDetailProps = {
//   ip: string
//   method: string
//   pathname: string
//   createdAt: Date
// }

export function WebhookHeaderDetail() {
  return (
    <div className="space-y-4 border-zinc-700 border-b p-6">
      <div className="flex items-center gap-3">
        <Badge>
          POST
          {/* {method} */}
        </Badge>
        <span className="font-medium text-lg text-zinc-300">
          /videos/julius
          {/* {pathname} */}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>From IP</span>
          <span className="underline underline-offset-4">
            192.168.254.254
            {/* {ip} */}
          </span>
        </div>
        <span className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>em</span>
          <span>
            {new Date().toLocaleString('pt-BR')}
            {/* {createdAt.toLocaleString('pt-BR')} */}
          </span>
        </div>
      </div>
    </div>
  )
}
