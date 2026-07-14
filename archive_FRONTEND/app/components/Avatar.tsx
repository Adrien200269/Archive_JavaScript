'use client'

import { useState } from 'react'

const COLORS = [
  '#6b6bf0', '#a78bfa', '#f472b6', '#34d399',
  '#f59e0b', '#ef4444', '#06b6d4', '#10b981',
]

function getColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return COLORS[hash % COLORS.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function generateLetterSvg(name: string, size: number): string {
  const initials = getInitials(name)
  const color = getColor(name)
  const fontSize = Math.round(size * 0.42)
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${size / 2}" fill="${color}"/>
      <text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}" font-weight="700" font-family="DM Sans, sans-serif" fill="white">${initials}</text>
    </svg>`
  )}`
}

interface AvatarProps {
  src?: string
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function Avatar({ src, name, size = 88, className, style }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const imgSrc = src && !failed ? src : generateLetterSvg(name || 'U', size)

  return (
    <img
      src={imgSrc}
      alt={name || 'Avatar'}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setFailed(true)}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        width: size,
        height: size,
        ...style,
      }}
    />
  )
}

export { getInitials, getColor, generateLetterSvg }
