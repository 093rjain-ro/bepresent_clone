import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  icon: string
  label: string
  locked?: boolean
}

export function AchievementBadge({ icon, label, locked }: Props) {
  return (
    <View style={{
      flex: 1, 
      padding: 12, 
      borderRadius: 8, 
      alignItems: 'center', 
      gap: 8,
      backgroundColor: locked ? '#f3f4f6' : '#f0fdf4',
      borderWidth: 1,
      borderColor: locked ? 'transparent' : '#bbf7d0'
    }}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={{
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: locked ? '#9ca3af' : '#15803d'
      }}>
        {label}
      </Text>
    </View>
  )
}
