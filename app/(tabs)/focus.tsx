import React, { useState, useEffect } from 'react'
import { View, Pressable, Alert } from 'react-native'
import { Text } from '@/components/ui/Text'
import { useStartFocusSession, useCompleteFocusSession } from '@/hooks/useFocusSessions'
import { FOCUS_SESSION_DEFAULT, POINTS_PER_COMPLETED_SESSION, DEMO_MODE } from '@/lib/constants'
import { BG, ACCENT } from '@/lib/theme'

const EMOJIS = ['😊', '😐', '😔', '😡', '😴']

export default function FocusScreen() {
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_SESSION_DEFAULT)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionState, setSessionState] = useState<'idle' | 'pre_mood' | 'focusing' | 'post_mood'>('idle')
  const [preMood, setPreMood] = useState<string | undefined>()

  const startSession = useStartFocusSession()
  // We use a mock ID if none is set
  const completeSession = useCompleteFocusSession(sessionId || 'mock-id')

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setSessionState('post_mood')
          return FOCUS_SESSION_DEFAULT
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStartFlow = () => {
    setSessionState('pre_mood')
  }

  const handlePreMoodSelect = async (mood: string) => {
    setPreMood(mood)
    const { id } = await startSession.mutateAsync({ duration: FOCUS_SESSION_DEFAULT, mood })
    setSessionId(id)
    setSessionState('focusing')
    setIsRunning(true)
  }

  const handlePauseOrQuit = () => {
    const elapsed = FOCUS_SESSION_DEFAULT - timeRemaining
    // Trigger Anthropic AI Nudge if elapsed > 18 mins (or > 5s in DEMO_MODE)
    const threshold = DEMO_MODE ? 5 : 18 * 60

    if (elapsed > threshold && timeRemaining > 0) {
      Alert.alert(
        "AI Coaching",
        "You're almost there! Your best focus window this week was always the last stretch. Keep going?",
        [
          { text: "Keep Focusing", style: "cancel", onPress: () => setIsRunning(true) },
          { text: "Quit Anyway", style: "destructive", onPress: () => {
              setIsRunning(false)
              setSessionState('post_mood')
            }
          }
        ]
      )
      setIsRunning(false) // Pause while alert is shown
    } else {
      setIsRunning(!isRunning)
    }
  }

  const handlePostMoodSelect = async (mood: string) => {
    await completeSession.mutateAsync({ pointsEarned: POINTS_PER_COMPLETED_SESSION, mood })
    setSessionState('idle')
    setSessionId(null)
    setPreMood(undefined)
    setTimeRemaining(FOCUS_SESSION_DEFAULT)
    Alert.alert("Session Complete!", `You earned +${POINTS_PER_COMPLETED_SESSION} points!`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (sessionState === 'pre_mood' || sessionState === 'post_mood') {
    return (
      <View style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {sessionState === 'pre_mood' ? 'How are you feeling before?' : 'How are you feeling after?'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {EMOJIS.map(e => (
            <Pressable key={e} onPress={() => sessionState === 'pre_mood' ? handlePreMoodSelect(e) : handlePostMoodSelect(e)} style={{ padding: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50 }}>
              <Text style={{ fontSize: 32 }}>{e}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center', gap: 32 }}>
      <Text style={{ fontSize: 72, fontWeight: 'bold', color: ACCENT }}>
        {formatTime(timeRemaining)}
      </Text>
      
      <Pressable
        onPress={sessionState === 'idle' ? handleStartFlow : handlePauseOrQuit}
        style={{ backgroundColor: ACCENT, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
          {sessionState === 'idle' ? 'Start Focus' : (isRunning ? 'Pause' : 'Resume')}
        </Text>
      </Pressable>
    </View>
  )
}
