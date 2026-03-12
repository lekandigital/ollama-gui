<script setup lang="ts">
import { ref } from 'vue'
import { IconBrain, IconChevronDown } from '@tabler/icons-vue'

defineProps<{
  content: string
}>()

const expanded = ref(false)
</script>

<template>
  <div class="my-2 overflow-hidden rounded-lg border border-[var(--color-border)]">
    <button
      @click="expanded = !expanded"
      class="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-surface-3"
    >
      <IconBrain :size="14" class="text-accent-soft" />
      <span class="font-medium">Thinking</span>
      <IconChevronDown
        :size="14"
        class="ml-auto transition-transform"
        :class="{ 'rotate-180': expanded }"
      />
    </button>
    <Transition name="expand">
      <div v-if="expanded" class="border-t border-[var(--color-border)] bg-surface-0 px-3 py-2">
        <p class="whitespace-pre-wrap text-xs italic leading-relaxed text-text-muted">
          {{ content }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all var(--transition-normal);
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
