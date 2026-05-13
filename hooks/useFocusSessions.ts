import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
// (No useAuth import)
import { DEMO_MODE } from '@/lib/constants'

// Mock data for DEMO_MODE
let mockSessions: any[] = []
const DEMO_USER_ID = 'demo-user-123'

export function useFocusSessions() {
  return useQuery({
    queryKey: ['focus_sessions', DEMO_USER_ID],
    queryFn: async () => {
      if (!isSupabaseEnabled || DEMO_MODE) return mockSessions
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .is('deleted_at', null)
        .order('started_at', { ascending: false })
        
      if (error) throw error
      return data ?? []
    },
    placeholderData: [],
  })
}

export function useStartFocusSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ duration, mood }: { duration: number, mood?: string }) => {
      const newSession = {
        id: Math.random().toString(36).substring(7),
        user_id: DEMO_USER_ID,
        session_type: 'focus',
        duration_seconds: duration,
        started_at: new Date().toISOString(),
        pre_session_mood: mood,
        completed: false,
      }
      
      if (!isSupabaseEnabled || DEMO_MODE) {
        mockSessions = [newSession, ...mockSessions]
        return newSession
      }

      const { data, error } = await supabase
        .from('focus_sessions')
        .insert(newSession)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus_sessions'] })
    },
  })
}

export function useCompleteFocusSession(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pointsEarned, mood }: { pointsEarned: number, mood?: string }) => {
      if (!isSupabaseEnabled || DEMO_MODE) {
        mockSessions = mockSessions.map(s => 
          s.id === sessionId ? { ...s, completed: true, ended_at: new Date().toISOString(), points_earned: pointsEarned, post_session_mood: mood } : s
        )
        return mockSessions.find(s => s.id === sessionId)
      }

      const { data, error } = await supabase
        .from('focus_sessions')
        .update({
          completed: true,
          ended_at: new Date().toISOString(),
          points_earned: pointsEarned,
          post_session_mood: mood,
        })
        .eq('id', sessionId)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus_sessions'] })
      queryClient.invalidateQueries({ queryKey: ['daily_usage_stats'] })
    },
  })
}
