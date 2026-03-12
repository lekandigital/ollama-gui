<script setup lang="ts">
import { IconX, IconDownload, IconUpload, IconTrash } from '@tabler/icons-vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useChatStore } from '@/stores/chatStore'
import { useUiStore } from '@/stores/uiStore'
import { ref } from 'vue'

const settings = useSettingsStore()
const chat = useChatStore()
const ui = useUiStore()
const fileInput = ref<HTMLInputElement>()
const confirmWipe = ref(false)

async function handleExport() {
  const data = await chat.exportChats()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ollama-chats-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImportClick() {
  fileInput.value?.click()
}

async function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const text = await file.text()
  await chat.importChats(text)
}

async function handleWipe() {
  if (!confirmWipe.value) {
    confirmWipe.value = true
    setTimeout(() => { confirmWipe.value = false }, 3000)
    return
  }
  await chat.wipeAllData()
  confirmWipe.value = false
}
</script>

<template>
  <div class="flex h-full flex-col border-l border-[var(--color-border)] bg-surface-1">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
      <h2 class="text-sm font-semibold text-text-primary">Settings</h2>
      <button
        @click="ui.settingsOpen = false"
        class="rounded-md p-1 text-text-muted hover:bg-surface-2 hover:text-text-primary"
      >
        <IconX :size="18" />
      </button>
    </div>

    <div class="flex-1 space-y-6 overflow-y-auto p-4">
      <!-- Appearance -->
      <section>
        <h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
          Appearance
        </h3>
        <div class="space-y-3">
          <label class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Enable Markdown</span>
            <input
              type="checkbox"
              v-model="settings.enableMarkdown"
              class="h-4 w-4 rounded border-[var(--color-border)] bg-surface-2 text-accent focus:ring-accent"
            />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Show System Messages</span>
            <input
              type="checkbox"
              v-model="settings.showSystemMessages"
              class="h-4 w-4 rounded border-[var(--color-border)] bg-surface-2 text-accent focus:ring-accent"
            />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Show Response Metrics</span>
            <input
              type="checkbox"
              v-model="settings.showMetrics"
              class="h-4 w-4 rounded border-[var(--color-border)] bg-surface-2 text-accent focus:ring-accent"
            />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Auto-generate Titles</span>
            <input
              type="checkbox"
              v-model="settings.autoTitle"
              class="h-4 w-4 rounded border-[var(--color-border)] bg-surface-2 text-accent focus:ring-accent"
            />
          </label>
          <label class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">Send on Enter</span>
            <input
              type="checkbox"
              v-model="settings.sendOnEnter"
              class="h-4 w-4 rounded border-[var(--color-border)] bg-surface-2 text-accent focus:ring-accent"
            />
          </label>
        </div>
      </section>

      <!-- Connection -->
      <section>
        <h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
          Connection
        </h3>
        <div class="space-y-3">
          <label class="block">
            <span class="mb-1 block text-sm text-text-secondary">Ollama API URL</span>
            <input
              v-model="settings.baseUrl"
              type="text"
              class="w-full rounded-lg border border-[var(--color-border)] bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm text-text-secondary">
              History Length: {{ settings.historyLength }} messages
            </span>
            <input
              v-model.number="settings.historyLength"
              type="range"
              min="1"
              max="50"
              class="w-full accent-accent"
            />
          </label>
        </div>
      </section>

      <!-- Data -->
      <section>
        <h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
          Data
        </h3>
        <div class="space-y-2">
          <button
            @click="handleExport"
            class="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
          >
            <IconDownload :size="16" />
            Export Chats
          </button>
          <button
            @click="handleImportClick"
            class="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
          >
            <IconUpload :size="16" />
            Import Chats
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
          />
          <button
            @click="handleWipe"
            :class="[
              'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
              confirmWipe
                ? 'border-danger bg-danger/10 text-danger'
                : 'border-[var(--color-border)] text-text-secondary hover:bg-surface-2 hover:text-danger',
            ]"
          >
            <IconTrash :size="16" />
            {{ confirmWipe ? 'Click again to confirm' : 'Wipe All Data' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
