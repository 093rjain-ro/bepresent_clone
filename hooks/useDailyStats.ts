import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { DEMO_MODE } from '@/lib/constants'

const DEMO_USER_ID = 'demo-user-123'

// Mock Data
let mockDailyStats = {
  total_focus_seconds: 0,
  sessions_completed: 0,
  points_earned: 0,
  daily_goal_met: false,
  streak_count: 1,
  donated_hours: 0,
}

let mockWeeklyStats = [
  { date: '2024-05-01', total_focus_seconds: 7200, daily_goal_met: false },
  { date: '2024-05-02', total_focus_seconds: 14400, daily_goal_met: false },
  { date: '2024-05-03', total_focus_seconds: 21600, daily_goal_met: true },
  { date: '2024-05-04', total_focus_seconds: 19800, daily_goal_met: true },
  { date: '2024-05-05', total_focus_seconds: 25000, daily_goal_met: true },
]

export function useTodayStats() {
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['daily_stats', DEMO_USER_ID, today],
    queryFn: async () => {
      if (!isSupabaseEnabled || DEMO_MODE) return mockDailyStats

      const { data, error } = await supabase
        .from('daily_usage_stats')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .eq('date', today)
        .maybeSingle()
        
      if (error) throw error
      return data || {
        total_focus_seconds: 0,
        sessions_completed: 0,
        points_earned: 0,
        daily_goal_met: false,
        streak_count: 0,
        donated_hours: 0,
      }
    },
    placeholderData: {
      total_focus_seconds: 0,
      sessions_completed: 0,
      points_earned: 0,
      daily_goal_met: false,
      streak_count: 0,
      donated_hours: 0,
    },
  })
}

export function useWeeklyStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return useQuery({
    queryKey: ['weekly_stats', DEMO_USER_ID],
    queryFn: async () => {
      if (!isSupabaseEnabled || DEMO_MODE) return mockWeeklyStats

      const { data, error } = await supabase
        .from('daily_usage_stats')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .gte('date', sevenDaysAgo)
        .order('date', { ascending: true })
        
      if (error) throw error
      return data ?? []
    },
    placeholderData: [],
  })
}
