<script setup lang="ts">
import { useChatStore } from '@/stores/chatStore'
import { useSettingsStore } from '@/stores/settingsStore'
import Markdown from '@/components/markdown/Markdown.vue'

const chat = useChatStore()
const settings = useSettingsStore()
</script>

<template>
  <div class="flex gap-3">
    <!-- Avatar -->
    <div class="flex-shrink-0 pt-1">
      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3">
        <img src="/logo.png" alt="AI" class="h-4 w-4" />
      </div>
    </div>

    <!-- Streaming content -->
    <div class="min-w-0 flex-1">
      <div class="rounded-2xl rounded-tl-md bg-surface-2 px-4 py-3">
        <div class="prose-chat text-sm text-text-primary">
          <Markdown
            v-if="settings.enableMarkdown"
            :content="chat.streamingContent"
          />
          <div v-else class="whitespace-pre-wrap break-words">
            {{ chat.streamingContent }}
          </div>
        </div>
        <!-- Typing cursor -->
        <span class="inline-block h-4 w-0.5 animate-pulse bg-accent-soft" />
      </div>
    </div>
  </div>
</template>
