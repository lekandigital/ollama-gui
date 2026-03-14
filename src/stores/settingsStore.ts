import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { ThemeMode, ThemePreset } from '@/types/settings'

export const THEME_PRESETS: { id: ThemePreset; label: string; mode: ThemeMode }[] = [
  { id: 'default-dark', label: 'Default Dark', mode: 'dark' },
  { id: 'default-light', label: 'Default Light', mode: 'light' },
  { id: 'hacker', label: 'Hacker', mode: 'dark' },
  { id: 'paper', label: 'Paper', mode: 'light' },
  { id: 'high-contrast', label: 'High Contrast', mode: 'dark' },
]

export const useSettingsStore = defineStore('settings', () => {
  const theme = useLocalStorage<ThemeMode>('theme', 'dark')
  const themePreset = useLocalStorage<ThemePreset>('themePreset', 'default-dark')
  const enableMarkdown = useLocalStorage('markdown', true)
  const showSystemMessages = useLocalStorage('systemMessages', true)
  const historyLength = useLocalStorage('historyMessageLength', 10)
  const baseUrl = useLocalStorage('baseUrl', '/api')
  const autoTitle = useLocalStorage('autoTitle', true)
  const showMetrics = useLocalStorage('showMetrics', true)
  const showTokenCounter = useLocalStorage('showTokenCounter', true)
  const sendOnEnter = useLocalStorage('sendOnEnter', true)

  // Migrate old URL format
  if (
    baseUrl.value.includes('11434') ||
    baseUrl.value.includes('11435') ||
    baseUrl.value.includes('localhost')
  ) {
    baseUrl.value = '/api'
  }

  function applyTheme() {
    const root = document.documentElement
    // Remove all theme classes
    root.classList.remove(
      'dark', 'light',
      'theme-default-dark', 'theme-default-light',
      'theme-hacker', 'theme-paper', 'theme-high-contrast',
    )
    // Apply mode class (dark/light) and preset class
    root.classList.add(theme.value)
    root.classList.add(`theme-${themePreset.value}`)
  }

  function setThemePreset(preset: ThemePreset) {
    themePreset.value = preset
    const presetConfig = THEME_PRESETS.find((p) => p.id === preset)
    if (presetConfig) {
      theme.value = presetConfig.mode
    }
    applyTheme()
  }

  function toggleTheme() {
    // Quick toggle between default dark/light
    if (theme.value === 'dark') {
      setThemePreset('default-light')
    } else {
      setThemePreset('default-dark')
    }
  }

  return {
    theme,
    themePreset,
    enableMarkdown,
    showSystemMessages,
    historyLength,
    baseUrl,
    autoTitle,
    showMetrics,
    showTokenCounter,
    sendOnEnter,
    applyTheme,
    toggleTheme,
    setThemePreset,
  }
})
