import React from 'react'
import { View, Text } from 'react-native'
import { ACCENT } from '@/lib/theme'

interface Props {
  data: { day: string; value: number }[]
}

export function BarChart({ data }: Props) {
  const maxVal = Math.max(...data.map(d => d.value), 1)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, paddingVertical: 16 }}>
      {data.map((item, index) => {
        const heightPercent = (item.value / maxVal) * 100
        return (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 20,
              height: `${heightPercent}%`,
              backgroundColor: ACCENT,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              minHeight: 4,
            }} />
            <Text style={{ marginTop: 8, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              {item.day}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
