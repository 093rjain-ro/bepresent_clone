import React, { useState, useEffect } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { Text } from '@/components/ui/Text'
import { useWeeklyStats } from '@/hooks/useDailyStats'
import { BarChart } from '@/components/BarChart'
import { BG, ACCENT } from '@/lib/theme'
import { DEMO_MODE } from '@/lib/constants'

export default function StatsScreen() {
  const { data: weeklyData = [] } = useWeeklyStats()
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(true)

  const totalFocusTime = weeklyData.reduce((sum, day) => sum + day.total_focus_seconds, 0)
  const completedDays = weeklyData.filter(day => day.daily_goal_met).length
  const averageFocus = weeklyData.length ? totalFocusTime / weeklyData.length : 0

  useEffect(() => {
    // Simulate Anthropic API Call for Distraction Pattern Analysis
    setTimeout(() => {
      setAiInsight("AI Analysis: You abandon 70% of sessions after notifications from WhatsApp at 3 PM. Try scheduling your long break around this time to avoid breaking your focus streak.")
      setLoadingInsight(false)
    }, 1500)
  }, [])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ padding: 24, gap: 24, paddingTop: 48 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>This week</Text>
        
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: ACCENT }}>
          {Math.floor(totalFocusTime / 3600)}h {Math.floor((totalFocusTime % 3600) / 60)}m focused
        </Text>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Avg. daily</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              {Math.floor(averageFocus / 3600)}h {Math.floor((averageFocus % 3600) / 60)}m
            </Text>
          </View>
          
          <View style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Days complete</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{completedDays}/7</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <BarChart data={weeklyData.map(day => ({
          day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          value: day.total_focus_seconds / 3600
        }))} />

        {/* AI Distraction Pattern Analysis */}
        <View style={{ backgroundColor: 'rgba(29, 158, 117, 0.1)', borderWidth: 1, borderColor: 'rgba(29, 158, 117, 0.3)', padding: 20, borderRadius: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 12 }}>🤖 Distraction Pattern Analysis</Text>
          {loadingInsight ? (
            <ActivityIndicator color={ACCENT} style={{ alignSelf: 'flex-start' }} />
          ) : (
            <Text style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 22 }}>
              {aiInsight}
            </Text>
          )}
        </View>

        {/* Co-Study Rooms (India-Specific Social feature) */}
        <View style={{ backgroundColor: '#1a1a1a', padding: 20, borderRadius: 16, marginTop: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>👥 Hostel Co-Study Rooms</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Join a live Pomodoro session with your hostel roommates.</Text>
          <View style={{ backgroundColor: '#242424', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Room 402 - JEE Prep</Text>
            <Text style={{ color: ACCENT, fontWeight: 'bold' }}>Join →</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
