import React from 'react'
import { View, ScrollView } from 'react-native'
import { useTodayStats } from '@/hooks/useDailyStats'
import { ProgressRing } from '@/components/ProgressRing'
import { AchievementBadge } from '@/components/AchievementBadge'
import { Text } from '@/components/ui/Text'
import { BG, ACCENT } from '@/lib/theme'

export default function HomeScreen() {
  const { data: stats } = useTodayStats()

  const totalFocusSeconds = stats?.total_focus_seconds || 0
  const focusHours = Math.floor(totalFocusSeconds / 3600)
  const focusMinutes = Math.floor((totalFocusSeconds % 3600) / 60)
  const goalPercentage = (totalFocusSeconds / (5.5 * 3600)) * 100

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ padding: 24, gap: 24, paddingTop: 48 }}>
        
        {/* Header & Streak */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 4 }}>Today's focus</Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
              {focusHours}h {focusMinutes}m
            </Text>
          </View>
          
          {(stats?.streak_count || 1) > 0 && (
            <View style={{ backgroundColor: 'rgba(216, 90, 48, 0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>🔥</Text>
              <Text style={{ fontWeight: 'bold', color: '#f97316' }}>
                {stats?.streak_count || 1}-day
              </Text>
            </View>
          )}
        </View>

        {/* Daily Goal Ring */}
        <View style={{ backgroundColor: '#1a1a1a', padding: 24, borderRadius: 16, alignItems: 'center', gap: 16 }}>
          <ProgressRing
            percentage={Math.min(goalPercentage, 100)}
            size={160}
            label={`${Math.round(goalPercentage)}%`}
            color={ACCENT}
          />
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
            Daily goal: 5h 30m
          </Text>
        </View>

        {/* Points Earned */}
        <View style={{ backgroundColor: 'rgba(99, 153, 34, 0.1)', borderWidth: 1, borderColor: 'rgba(99, 153, 34, 0.3)', padding: 24, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 4 }}>Points today</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#4ade80' }}>
              +{stats?.points_earned || 0}
            </Text>
          </View>
          <Text style={{ fontSize: 48 }}>⭐</Text>
        </View>

        {/* Donate Focus Hours (India-Specific Social Impact) */}
        <View style={{ backgroundColor: 'rgba(29, 158, 117, 0.1)', borderWidth: 1, borderColor: 'rgba(29, 158, 117, 0.3)', padding: 20, borderRadius: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Impact 🇮🇳</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>Donate your completed focus hours to fund scholarships for rural students.</Text>
          <View style={{ backgroundColor: ACCENT, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Donate {focusHours} Hours</Text>
          </View>
        </View>

        {/* Achievements */}
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', marginBottom: 12, textTransform: 'uppercase' }}>
            Achievements
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <AchievementBadge icon="🎯" label="Perfect week" locked={true} />
            <AchievementBadge icon="🔥" label="5-day streak" locked={false} />
            <AchievementBadge icon="🧘" label="Zen Master" locked={true} />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
