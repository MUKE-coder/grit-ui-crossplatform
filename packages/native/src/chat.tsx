import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Animated,
  type ListRenderItemInfo,
} from 'react-native'
import { cn } from '@grit-ui/core'

// ─── Types ───────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  text: string
  alignment: 'left' | 'right'
  timestamp?: string
  avatar?: string
}

interface ChatProps {
  className?: string
  messages: ChatMessage[]
  onSend?: (text: string) => void
  showTypingIndicator?: boolean
  placeholder?: string
  headerTitle?: string
  headerSubtitle?: string
}

interface ChatHeaderProps {
  className?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
}

interface ChatBubbleProps {
  className?: string
  text: string
  alignment: 'left' | 'right'
  timestamp?: string
  avatar?: string
}

interface ChatInputProps {
  className?: string
  placeholder?: string
  onSend?: (text: string) => void
}

interface ChatTypingIndicatorProps {
  className?: string
}

// ─── ChatHeader ──────────────────────────────────────────────────────

function ChatHeader({ className, title, subtitle, children }: ChatHeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center px-4 py-3 border-b border-border bg-background',
        className
      )}
    >
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="text-xs text-muted-foreground mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </View>
  )
}

// ─── ChatBubble ──────────────────────────────────────────────────────

function ChatBubble({ className, text, alignment, timestamp, avatar }: ChatBubbleProps) {
  const isRight = alignment === 'right'

  return (
    <View
      className={cn(
        'flex-row items-end gap-2 mb-2 px-4',
        isRight ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {!isRight && avatar ? (
        <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
          <Text className="text-xs text-muted-foreground">{avatar}</Text>
        </View>
      ) : null}
      <View
        className={cn(
          'max-w-[75%] rounded-2xl px-3 py-2',
          isRight
            ? 'bg-primary rounded-br-sm'
            : 'bg-muted rounded-bl-sm'
        )}
      >
        <Text
          className={cn(
            'text-sm',
            isRight ? 'text-primary-foreground' : 'text-foreground'
          )}
        >
          {text}
        </Text>
        {timestamp ? (
          <Text
            className={cn(
              'text-[10px] mt-1',
              isRight ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {timestamp}
          </Text>
        ) : null}
      </View>
      {isRight && avatar ? (
        <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
          <Text className="text-xs text-primary">{avatar}</Text>
        </View>
      ) : null}
    </View>
  )
}

// ─── ChatTypingIndicator ─────────────────────────────────────────────

function ChatTypingIndicator({ className }: ChatTypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      )

    const a1 = animateDot(dot1, 0)
    const a2 = animateDot(dot2, 150)
    const a3 = animateDot(dot3, 300)

    a1.start()
    a2.start()
    a3.start()

    return () => {
      a1.stop()
      a2.stop()
      a3.stop()
    }
  }, [dot1, dot2, dot3])

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  })

  return (
    <View className={cn('flex-row items-end gap-2 mb-2 px-4', className)}>
      <View className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex-row gap-1">
        <Animated.View
          style={dotStyle(dot1)}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
        <Animated.View
          style={dotStyle(dot2)}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
        <Animated.View
          style={dotStyle(dot3)}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
      </View>
    </View>
  )
}

// ─── ChatInput ───────────────────────────────────────────────────────

function ChatInput({ className, placeholder = 'Type a message...', onSend }: ChatInputProps) {
  const [text, setText] = React.useState('')

  const handleSend = () => {
    const trimmed = text.trim()
    if (trimmed && onSend) {
      onSend(trimmed)
      setText('')
    }
  }

  return (
    <View
      className={cn(
        'flex-row items-end gap-2 px-4 py-3 border-t border-border bg-background',
        className
      )}
    >
      <TextInput
        className="flex-1 min-h-[40px] max-h-[120px] rounded-2xl bg-muted px-4 py-2 text-sm text-foreground"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        multiline
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <Pressable
        onPress={handleSend}
        className={cn(
          'w-10 h-10 rounded-full items-center justify-center',
          text.trim() ? 'bg-primary' : 'bg-muted'
        )}
        disabled={!text.trim()}
      >
        <Text
          className={cn(
            'text-base',
            text.trim() ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          {'->'}
        </Text>
      </Pressable>
    </View>
  )
}

// ─── Chat (Composed) ─────────────────────────────────────────────────

function Chat({
  className,
  messages,
  onSend,
  showTypingIndicator = false,
  placeholder,
  headerTitle,
  headerSubtitle,
}: ChatProps) {
  const flatListRef = useRef<FlatList<ChatMessage>>(null)

  const renderItem = ({ item }: ListRenderItemInfo<ChatMessage>) => (
    <ChatBubble
      text={item.text}
      alignment={item.alignment}
      timestamp={item.timestamp}
      avatar={item.avatar}
    />
  )

  return (
    <View className={cn('flex-1 bg-background', className)}>
      {headerTitle ? (
        <ChatHeader title={headerTitle} subtitle={headerSubtitle} />
      ) : null}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="py-4"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />
      {showTypingIndicator ? <ChatTypingIndicator /> : null}
      <ChatInput placeholder={placeholder} onSend={onSend} />
    </View>
  )
}

export { Chat, ChatHeader, ChatBubble, ChatInput, ChatTypingIndicator }
export type {
  ChatProps,
  ChatMessage,
  ChatHeaderProps,
  ChatBubbleProps,
  ChatInputProps,
  ChatTypingIndicatorProps,
}
