import type { ReactNode } from 'react'

type ChatSectionProps = {
  messages: any[]
  renderMessage: (message: any) => ReactNode
}

function ChatSection({ messages, renderMessage }: ChatSectionProps) {
  return (
    <div className="h-96 w-full bg-gray-50 border border-gray-200 rounded-xl p-4  flex flex-col gap-4  custom-scrollbar overflow-y-auto">
      {messages.length === 0 && (
        <div className="text-center text-sm text-gray-400 mt-2">
          Start a conversation or load history.
        </div>
      )}
      {messages.map(renderMessage)}
    </div>        
  )
}


export default ChatSection
