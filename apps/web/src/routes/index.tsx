import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomeComponent })

function HomeComponent() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
        <h3 className='font-semibold text-lg text-zinc-200'>No webhook selected</h3>
        <p className='max-w-md text-sm text-zinc-400'>
          Select a webhook from the list to view its details
        </p>
      </div>
    </div>

  )
}
