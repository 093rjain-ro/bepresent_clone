import React from 'react'
import { View, ScrollView, Switch, Pressable } from 'react-native'
import { Text } from '@/components/ui/Text'
import { useAppLimits, useSetAppLimit } from '@/hooks/useAppLimits'
import { BG, ACCENT, ERROR } from '@/lib/theme'
import { Stack } from 'expo-router'

export default function AppLimitsScreen() {
  const { data: limits = [] } = useAppLimits()
  const setLimit = useSetAppLimit()

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }}>
      <Stack.Screen options={{ title: 'App Limits', headerStyle: { backgroundColor: BG }, headerTintColor: 'white' }} />
      <View style={{ padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Restricted Apps</Text>

        {limits.map((limit) => (
          <View key={limit.id} style={{ backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>{limit.app_name}</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{limit.daily_limit_seconds / 60} min</Text>
            </View>
            
            <View style={{ height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' }}>
              <View
                style={{ backgroundColor: ERROR, height: '100%', width: '65%' }} // Mock 65% used
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Block during focus sessions</Text>
              <Switch 
                value={limit.is_blocked_during_focus} 
                trackColor={{ false: '#767577', true: ACCENT }}
                onValueChange={() => {}}
                // Real implementation would update via setLimit.mutate()
              />
            </View>
          </View>
        ))}

        <Pressable style={{ backgroundColor: 'rgba(29, 158, 117, 0.1)', borderWidth: 1, borderColor: ACCENT, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: ACCENT, fontWeight: 'bold', fontSize: 16 }}>+ Add App Limit</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
