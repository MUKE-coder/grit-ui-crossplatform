import React from 'react'
import { View, Text, TextInput, Switch, Pressable } from 'react-native'
import { cn } from '@grit-ui/core'

type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'boolean' | 'select'

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  description?: string
  options?: { label: string; value: string }[]
  defaultValue?: string | boolean | number
}

interface AutoFormProps {
  className?: string
  fields: FieldConfig[]
  values: Record<string, any>
  errors?: Record<string, string>
  onChange: (name: string, value: any) => void
  onSubmit?: () => void
  submitLabel?: string
}

function AutoForm({
  className,
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  submitLabel = 'Submit',
}: AutoFormProps) {
  const renderField = (field: FieldConfig) => {
    const value = values[field.name]
    const error = errors?.[field.name]

    return (
      <View key={field.name} className="gap-1.5">
        <Text className="text-sm font-medium text-foreground">
          {field.label}
          {field.required && <Text className="text-destructive"> *</Text>}
        </Text>

        {field.type === 'boolean' ? (
          <Switch
            value={!!value}
            onValueChange={(v) => onChange(field.name, v)}
            trackColor={{ false: '#2a2a3a', true: '#6c5ce7' }}
          />
        ) : field.type === 'select' ? (
          <View className="gap-1">
            {field.options?.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => onChange(field.name, opt.value)}
                className={cn(
                  'rounded-md border px-3 py-2',
                  value === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background'
                )}
              >
                <Text
                  className={cn(
                    'text-sm',
                    value === opt.value ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <TextInput
            value={String(value ?? '')}
            onChangeText={(text) =>
              onChange(field.name, field.type === 'number' ? Number(text) : text)
            }
            placeholder={field.placeholder}
            placeholderTextColor="#9090a8"
            secureTextEntry={field.type === 'password'}
            keyboardType={field.type === 'number' ? 'numeric' : field.type === 'email' ? 'email-address' : 'default'}
            multiline={field.type === 'textarea'}
            numberOfLines={field.type === 'textarea' ? 4 : 1}
            className={cn(
              'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground',
              field.type === 'textarea' && 'min-h-[100px]',
              error && 'border-destructive'
            )}
          />
        )}

        {field.description && !error && (
          <Text className="text-xs text-muted-foreground">{field.description}</Text>
        )}
        {error && <Text className="text-xs text-destructive">{error}</Text>}
      </View>
    )
  }

  return (
    <View className={cn('gap-4', className)}>
      {fields.map(renderField)}
      {onSubmit && (
        <Pressable
          onPress={onSubmit}
          className="items-center rounded-md bg-primary py-2.5"
        >
          <Text className="text-sm font-medium text-primary-foreground">{submitLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}

export { AutoForm }
export type { AutoFormProps, FieldConfig, FieldType }
