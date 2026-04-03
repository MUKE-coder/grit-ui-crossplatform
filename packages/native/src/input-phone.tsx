import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Modal, FlatList } from 'react-native'
import { cn } from '@grit-ui/core'

interface CountryCode {
  code: string
  dial: string
  flag: string
}

const defaultCountries: CountryCode[] = [
  { code: 'US', dial: '+1', flag: 'US' },
  { code: 'GB', dial: '+44', flag: 'GB' },
  { code: 'IN', dial: '+91', flag: 'IN' },
  { code: 'DE', dial: '+49', flag: 'DE' },
  { code: 'FR', dial: '+33', flag: 'FR' },
  { code: 'JP', dial: '+81', flag: 'JP' },
  { code: 'AU', dial: '+61', flag: 'AU' },
  { code: 'CA', dial: '+1', flag: 'CA' },
  { code: 'BR', dial: '+55', flag: 'BR' },
  { code: 'KE', dial: '+254', flag: 'KE' },
  { code: 'NG', dial: '+234', flag: 'NG' },
  { code: 'ZA', dial: '+27', flag: 'ZA' },
  { code: 'UG', dial: '+256', flag: 'UG' },
]

interface InputPhoneProps {
  className?: string
  value?: string
  onChangePhone?: (phone: string) => void
  countryCode?: string
  onChangeCountry?: (country: CountryCode) => void
  placeholder?: string
  countries?: CountryCode[]
}

function InputPhone({
  className,
  value = '',
  onChangePhone,
  countryCode = '+1',
  onChangeCountry,
  placeholder = 'Phone number',
  countries = defaultCountries,
}: InputPhoneProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const selected = countries.find((c) => c.dial === countryCode) || countries[0]

  return (
    <View className={cn('flex-row items-center rounded-md border border-border bg-background', className)}>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center border-r border-border px-3 py-2"
      >
        <Text className="text-sm text-foreground">{selected.flag}</Text>
        <Text className="ml-1 text-sm text-foreground">{selected.dial}</Text>
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangePhone}
        placeholder={placeholder}
        placeholderTextColor="#9090a8"
        keyboardType="phone-pad"
        className="flex-1 px-3 py-2 text-sm text-foreground"
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setModalVisible(false)}>
          <View className="mt-auto max-h-[60%] rounded-t-2xl bg-background">
            <View className="border-b border-border px-4 py-3">
              <Text className="text-base font-semibold text-foreground">Select Country</Text>
            </View>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChangeCountry?.(item)
                    setModalVisible(false)
                  }}
                  className={cn(
                    'flex-row items-center px-4 py-3',
                    item.dial === countryCode && 'bg-primary/10'
                  )}
                >
                  <Text className="text-base">{item.flag}</Text>
                  <Text className="ml-3 flex-1 text-sm text-foreground">{item.code}</Text>
                  <Text className="text-sm text-muted-foreground">{item.dial}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export { InputPhone, defaultCountries }
export type { InputPhoneProps, CountryCode }
