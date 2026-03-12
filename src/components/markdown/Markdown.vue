<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string) {
    const langLabel = lang || 'text'
    const copyId = `code-${Math.random().toString(36).slice(2, 8)}`

    let highlighted: string
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(str, { language: lang }).value
      } catch {
        highlighted = md.utils.escapeHtml(str)
      }
    } else {
      highlighted = md.utils.escapeHtml(str)
    }

    const lines = str.split('\n').length
    const showLineNumbers = lines > 10

    return `<div class="code-block group relative my-3">
      <div class="flex items-center justify-between rounded-t-lg bg-[var(--color-surface-3)] px-3 py-1">
        <span class="text-2xs text-text-muted">${langLabel}</span>
        <button
          onclick="navigator.clipboard.writeText(document.getElementById('${copyId}').textContent).then(()=>{this.textContent='Copied!';setTimeout(()=>{this.textContent='Copy'},2000)})"
          class="text-2xs text-text-muted transition-colors hover:text-text-primary"
        >Copy</button>
      </div>
      <pre class="!mt-0 overflow-x-auto rounded-b-lg rounded-t-none !bg-[var(--color-surface-0)] p-3 ${showLineNumbers ? 'line-numbers' : ''}"><code id="${copyId}" class="text-sm font-mono hljs language-${langLabel}">${highlighted}</code></pre>
    </div>`
  },
})

const rendered = computed(() => md.render(props.content))
</script>

<template>
  <div v-html="rendered" />
</template>
