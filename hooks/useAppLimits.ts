import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { DEMO_MODE } from '@/lib/constants'

const DEMO_USER_ID = 'demo-user-123'

let mockLimits = [
  { id: '1', app_name: 'Instagram', app_bundle_id: 'com.burbn.instagram', daily_limit_seconds: 1800, is_blocked_during_focus: true },
  { id: '2', app_name: 'TikTok', app_bundle_id: 'com.zhiliaoapp.musically', daily_limit_seconds: 900, is_blocked_during_focus: true },
  { id: '3', app_name: 'YouTube', app_bundle_id: 'com.google.ios.youtube', daily_limit_seconds: 3600, is_blocked_during_focus: false },
]

export function useAppLimits() {
  return useQuery({
    queryKey: ['app_limits', DEMO_USER_ID],
    queryFn: async () => {
      if (!isSupabaseEnabled || DEMO_MODE) return mockLimits

      const { data, error } = await supabase
        .from('app_limits')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .is('deleted_at', null)
        
      if (error) throw error
      return data ?? []
    },
    placeholderData: [],
  })
}

export function useSetAppLimit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (limit: {
      app_name: string
      app_bundle_id: string
      daily_limit_seconds: number
      is_blocked_during_focus: boolean
    }) => {
      if (!isSupabaseEnabled || DEMO_MODE) {
        const newLimit = { id: Math.random().toString(), user_id: DEMO_USER_ID, ...limit }
        mockLimits = [...mockLimits, newLimit]
        return newLimit
      }

      const { data, error } = await supabase
        .from('app_limits')
        .upsert(
          {
            user_id: DEMO_USER_ID,
            ...limit,
          },
          { onConflict: 'user_id,app_bundle_id' }
        )
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_limits'] })
    },
  })
}
