<script setup lang="ts">
import { ref } from 'vue'
import { useTextareaAutosize } from '@vueuse/core'
import { IconSend, IconPlayerStop, IconRefresh } from '@tabler/icons-vue'
import { useChatStore } from '@/stores/chatStore'
import { useSettingsStore } from '@/stores/settingsStore'

const chat = useChatStore()
const settings = useSettingsStore()

const { textarea, input } = useTextareaAutosize()
const images = ref<string[]>([])

async function send() {
  const content = input.value.trim()
  if (!content && !images.value.length) return
  if (chat.isStreaming) return

  const imgs = images.value.length ? [...images.value] : undefined
  input.value = ''
  images.value = []
  await chat.sendMessage(content, imgs)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && settings.sendOnEnter) {
    e.preventDefault()
    send()
  }
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      if (file) readImageFile(file)
    }
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (!files) return

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      readImageFile(file)
    }
  }
}

function readImageFile(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    const base64 = (reader.result as string).split(',')[1]
    if (base64) images.value.push(base64)
  }
  reader.readAsDataURL(file)
}

function removeImage(index: number) {
  images.value.splice(index, 1)
}
</script>

<template>
  <div
    class="border-t border-[var(--color-border)] bg-surface-1 p-3 safe-area-bottom"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="mx-auto max-w-3xl">
      <!-- Image previews -->
      <div v-if="images.length" class="mb-2 flex flex-wrap gap-2">
        <div
          v-for="(img, i) in images"
          :key="i"
          class="relative"
        >
          <img
            :src="`data:image/png;base64,${img}`"
            class="h-16 rounded-lg border border-[var(--color-border)]"
            alt="Attached"
          />
          <button
            @click="removeImage(i)"
            class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] text-white"
          >
            &times;
          </button>
        </div>
      </div>

      <!-- Input row -->
      <div class="flex items-end gap-2">
        <textarea
          ref="textarea"
          v-model="input"
          @keydown="handleKeydown"
          @paste="handlePaste"
          placeholder="Type a message..."
          :disabled="!chat.activeChat?.model"
          rows="1"
          class="max-h-[40vh] min-h-[40px] flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-surface-2 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        />

        <!-- Send / Stop / Regenerate buttons -->
        <div class="flex gap-1">
          <button
            v-if="chat.isStreaming"
            @click="chat.abortStreaming()"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-danger text-white transition-colors hover:bg-red-600"
            title="Stop generating"
          >
            <IconPlayerStop :size="18" />
          </button>
          <template v-else>
            <button
              v-if="chat.hasMessages"
              @click="chat.regenerateLastResponse()"
              class="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
              title="Regenerate last response"
            >
              <IconRefresh :size="18" />
            </button>
            <button
              @click="send"
              :disabled="(!input.trim() && !images.length) || !chat.activeChat?.model"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-accent-soft disabled:opacity-50"
              title="Send message"
            >
              <IconSend :size="18" />
            </button>
          </template>
        </div>
      </div>

      <!-- Footer hints -->
      <div class="mt-1 flex items-center justify-between text-2xs text-text-muted">
        <span v-if="!chat.activeChat?.model" class="text-warning">
          Select a model to start chatting
        </span>
        <span v-else>
          {{ settings.sendOnEnter ? 'Enter to send, Shift+Enter for newline' : 'Shift+Enter to send' }}
        </span>
        <span v-if="input.length > 0">{{ input.length }} chars</span>
      </div>
    </div>
  </div>
</template>
