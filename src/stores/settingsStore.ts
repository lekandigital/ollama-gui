import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { ThemeMode } from '@/types/settings'

export const useSettingsStore = defineStore('settings', () => {
  const theme = useLocalStorage<ThemeMode>('theme', 'dark')
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
    root.classList.remove('dark', 'light')
    root.classList.add(theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  return {
    theme,
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
  }
})
