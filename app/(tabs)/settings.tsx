import React, { useState } from 'react'
import { View, ScrollView, Switch } from 'react-native'
import { Text } from '@/components/ui/Text'
import { BG, ACCENT } from '@/lib/theme'
import { Link } from 'expo-router'

export default function SettingsScreen() {
  const [examMode, setExamMode] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en')
  // In a real app we'd use `useAuth` to get signOut, but this is a stub.

  const handleLanguageChange = (lang: 'en' | 'hi' | 'te') => {
    setLanguage(lang)
    // Here we would call i18n.changeLanguage(lang)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ padding: 24, gap: 24, paddingTop: 48 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>Settings</Text>

        {/* India-Specific Features */}
        <View style={{ gap: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            Localization & Goals 🇮🇳
          </Text>
          
          <View style={{ backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Exam Season Mode</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>Auto-increases daily goal during JEE/NEET</Text>
            </View>
            <Switch 
              value={examMode} 
              onValueChange={setExamMode} 
              trackColor={{ false: '#767577', true: ACCENT }}
            />
          </View>

          <View style={{ backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, gap: 16 }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Display Language</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(['en', 'hi', 'te'] as const).map(lang => (
                <View 
                  key={lang} 
                  onTouchEnd={() => handleLanguageChange(lang)}
                  style={{ 
                    flex: 1, 
                    alignItems: 'center', 
                    paddingVertical: 8, 
                    backgroundColor: language === lang ? ACCENT : '#242424',
                    borderRadius: 8
                  }}
                >
                  <Text style={{ color: language === lang ? 'white' : 'rgba(255,255,255,0.6)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* General Settings */}
        <View style={{ gap: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            Account & Restrictions
          </Text>

          <Link href="/limits" asChild>
            <View style={{ backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>App Limits & Blocking</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>Manage restricted apps and daily limits</Text>
              </View>
              <Text style={{ color: ACCENT, fontWeight: 'bold' }}>Manage →</Text>
            </View>
          </Link>

          <View style={{ backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: 'bold' }}>Sign Out</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  )
}
