<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconBrain, IconChevronRight } from '@tabler/icons-vue'
import Markdown from '@/components/markdown/Markdown.vue'

const props = withDefaults(
  defineProps<{
    content: string
    isStreaming?: boolean
  }>(),
  { isStreaming: false },
)

const expanded = ref(false)

// Auto-collapse when streaming ends
watch(
  () => props.isStreaming,
  (streaming, wasStreaming) => {
    if (wasStreaming && !streaming) {
      expanded.value = false
    }
  },
)

const isExpanded = computed(() => props.isStreaming || expanded.value)
</script>

<template>
  <div class="my-2">
    <!-- Toggle header -->
    <button
      @click="expanded = !expanded"
      class="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-xs transition-colors hover:bg-surface-3/50"
      :class="isStreaming ? 'pointer-events-none' : 'cursor-pointer'"
    >
      <IconChevronRight
        :size="14"
        class="flex-shrink-0 transition-transform duration-200"
        :class="isExpanded ? 'rotate-90 text-accent-soft' : 'text-text-muted'"
      />
      <IconBrain
        :size="14"
        class="flex-shrink-0"
        :class="isStreaming ? 'text-accent-soft animate-pulse' : 'text-text-muted'"
      />
      <span
        class="font-medium"
        :class="isStreaming ? 'text-text-secondary' : 'text-text-muted'"
      >
        Thinking
        <span v-if="isStreaming" class="thinking-dots">
          <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </span>
      </span>
    </button>

    <!-- Thinking content -->
    <Transition name="think-expand">
      <div
        v-if="isExpanded"
        class="ml-[7px] mt-1 border-l-2 border-accent-soft/25 pl-4"
      >
        <div class="think-prose text-xs leading-relaxed text-text-muted">
          <Markdown :content="content" />
        </div>
        <span
          v-if="isStreaming"
          class="inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-accent-soft"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Animated thinking dots */
.thinking-dots .dot {
  animation: blink 1.4s infinite both;
  opacity: 0;
}
.thinking-dots .dot:nth-child(1) {
  animation-delay: 0s;
}
.thinking-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.thinking-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

/* Expand/collapse transition */
.think-expand-enter-active,
.think-expand-leave-active {
  transition: all var(--transition-normal);
  overflow: hidden;
}
.think-expand-enter-from,
.think-expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}
.think-expand-enter-to,
.think-expand-leave-from {
  max-height: 3000px;
  opacity: 1;
}

/* Subdued markdown styles for thinking content */
.think-prose :deep(p) {
  @apply my-1 first:mt-0 last:mb-0;
}
.think-prose :deep(pre) {
  @apply my-2 overflow-x-auto rounded-lg bg-surface-0 p-2 text-[11px];
}
.think-prose :deep(code:not(pre code)) {
  @apply rounded bg-surface-0 px-1 py-0.5 text-[11px];
}
.think-prose :deep(ul),
.think-prose :deep(ol) {
  @apply my-1 pl-4;
}
.think-prose :deep(li) {
  @apply my-0.5;
}
.think-prose :deep(h1),
.think-prose :deep(h2),
.think-prose :deep(h3) {
  @apply my-2 text-xs font-semibold text-text-secondary first:mt-0;
}
.think-prose :deep(blockquote) {
  @apply my-1 border-l-2 border-[var(--color-border)] pl-2 italic;
}
.think-prose :deep(a) {
  @apply text-accent-soft underline;
}
.think-prose :deep(table) {
  @apply my-2 w-full border-collapse text-[11px];
}
.think-prose :deep(th),
.think-prose :deep(td) {
  @apply border border-[var(--color-border)] px-2 py-1 text-left;
}
.think-prose :deep(th) {
  @apply bg-surface-3 font-medium;
}

/* Override code block styling to be more compact */
.think-prose :deep(.code-block) {
  @apply my-2;
}
</style>
