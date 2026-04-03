import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Chat variant definitions using CVA.
 */
const chatVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: 'bg-background',
      bordered: 'border border-border rounded-lg overflow-hidden',
      elevated: 'bg-background shadow-lg rounded-lg overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/**
 * ChatBubble variant definitions.
 */
const chatBubbleVariants = cva('inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm', {
  variants: {
    align: {
      left: 'bg-muted text-foreground rounded-bl-sm',
      right: 'bg-primary text-primary-foreground rounded-br-sm',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

/** Props for Chat. */
export interface ChatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatVariants> {}

/**
 * Chat UI container component.
 *
 * @example
 * ```tsx
 * <Chat variant="bordered">
 *   <ChatHeader>Support Chat</ChatHeader>
 *   <ChatMessage align="left" avatar="B" timestamp="10:00 AM">
 *     <ChatBubble align="left">Hello! How can I help?</ChatBubble>
 *   </ChatMessage>
 *   <ChatMessage align="right" timestamp="10:01 AM">
 *     <ChatBubble align="right">I have a question.</ChatBubble>
 *   </ChatMessage>
 *   <ChatInput onSend={(msg) => console.log(msg)} />
 * </Chat>
 * ```
 */
const Chat = React.forwardRef<HTMLDivElement, ChatProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(chatVariants({ variant }), 'h-full', className)} {...props} />
  )
)
Chat.displayName = 'Chat'

/**
 * Chat header with title area.
 */
const ChatHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3 border-b border-border px-4 py-3 text-sm font-medium text-foreground',
        className
      )}
      {...props}
    />
  )
)
ChatHeader.displayName = 'ChatHeader'

/** Props for ChatMessage. */
export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Message alignment. 'left' for received, 'right' for sent. */
  align?: 'left' | 'right'
  /** Avatar text or initials. */
  avatar?: string
  /** Avatar image URL. */
  avatarSrc?: string
  /** Timestamp string. */
  timestamp?: string
}

/**
 * Single chat message row with avatar and timestamp.
 */
const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ className, align = 'left', avatar, avatarSrc, timestamp, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex gap-2 px-4 py-1.5',
        align === 'right' ? 'flex-row-reverse' : 'flex-row',
        className
      )}
      {...props}
    >
      {(avatar || avatarSrc) && (
        <div className="flex-shrink-0 mt-1">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={avatar || 'avatar'}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
              {avatar}
            </div>
          )}
        </div>
      )}
      <div className={cn('flex flex-col gap-0.5', align === 'right' ? 'items-end' : 'items-start')}>
        {children}
        {timestamp && (
          <span className="text-[10px] text-muted-foreground px-1">{timestamp}</span>
        )}
      </div>
    </div>
  )
)
ChatMessage.displayName = 'ChatMessage'

/** Props for ChatBubble. */
export interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {}

/**
 * Message bubble with alignment-based styling.
 */
const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, align, ...props }, ref) => (
    <div ref={ref} className={cn(chatBubbleVariants({ align }), className)} {...props} />
  )
)
ChatBubble.displayName = 'ChatBubble'

/** Props for ChatInput. */
export interface ChatInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** Placeholder text. */
  placeholder?: string
  /** Called when message is sent. */
  onSend?: (message: string) => void
  /** Whether input is disabled. */
  disabled?: boolean
  /** Show typing indicator. */
  showTyping?: boolean
  /** Typing indicator text. */
  typingText?: string
}

/**
 * Chat input area with send button and optional typing indicator.
 */
const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      className,
      placeholder = 'Type a message...',
      onSend,
      disabled = false,
      showTyping = false,
      typingText = 'Typing...',
      ...props
    },
    ref
  ) => {
    const [message, setMessage] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleSend = () => {
      const trimmed = message.trim()
      if (!trimmed || disabled) return
      onSend?.(trimmed)
      setMessage('')
      inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    return (
      <div ref={ref} className={cn('border-t border-border', className)} {...props}>
        {showTyping && (
          <div className="px-4 py-1">
            <span className="text-xs text-muted-foreground animate-pulse">{typingText}</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-3">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className={cn(
              'inline-flex items-center justify-center rounded-md h-8 w-8 bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)
ChatInput.displayName = 'ChatInput'

export { Chat, chatVariants, ChatHeader, ChatMessage, ChatBubble, chatBubbleVariants, ChatInput }
