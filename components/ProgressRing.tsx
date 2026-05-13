import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface Props {
  percentage: number
  size: number
  label: string
  color?: string
}

export function ProgressRing({ percentage, size, label, color = '#1D9E75' }: Props) {
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color }}>{label}</Text>
      </View>
    </View>
  )
}
