<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'
import { useChats } from '../services/chat.ts'
import { useAI } from '../services/useAI.ts'
import { ref, computed } from 'vue'
import { currentModel } from '../services/appConfig'

const { activeChat, switchModel, hasMessages } = useChats()
const { refreshModels, availableModels } = useAI()

const refreshingModel = ref(false)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Model rankings based on LLM benchmarks (lower = better)
// Stars: 5=★★★★★, 4=★★★★☆, 3=★★★☆☆, 2=★★☆☆☆, 1=★☆☆☆☆
const modelRankings: Record<string, { rank: number; stars: string }> = {
  // Top tier - 5 stars
  'behemoth-123b': { rank: 1, stars: '★★★★★' },
  'huihui_ai/qwen3-abliterated:30b-a3b': { rank: 2, stars: '★★★★★' },
  'qwen3-uncensored': { rank: 3, stars: '★★★★★' },
  
  // Excellent - 4 stars  
  'huihui_ai/gemma3-abliterated:27b': { rank: 4, stars: '★★★★☆' },
  'gemma3-uncensored': { rank: 5, stars: '★★★★☆' },
  'huihui_ai/phi4-abliterated': { rank: 6, stars: '★★★★☆' },
  'phi4-uncensored': { rank: 7, stars: '★★★★☆' },
  'huihui_ai/nemotron-abliterated': { rank: 8, stars: '★★★★☆' },
  'mixtral:8x7b': { rank: 9, stars: '★★★★☆' },
  
  // Good - 3 stars
  'huihui_ai/glm-4.7-flash-abliterated': { rank: 10, stars: '★★★☆☆' },
  'glm4-uncensored': { rank: 11, stars: '★★★☆☆' },
  'huihui_ai/gpt-oss-abliterated': { rank: 12, stars: '★★★☆☆' },
  'mistral:latest': { rank: 13, stars: '★★★☆☆' },
  'Godmoded/llama3-lexi-uncensored': { rank: 14, stars: '★★★☆☆' },
  
  // Older/smaller - 2 stars
  'falcon:7b': { rank: 15, stars: '★★☆☆☆' },
  'Malicus7862/thebloke-luna-ai-llama2-uncensored-gguf': { rank: 16, stars: '★★☆☆☆' },
}

// Get ranking info for a model, checking various name formats
const getModelRanking = (modelName: string) => {
  // Try exact match first
  if (modelRankings[modelName]) {
    return modelRankings[modelName]
  }
  
  // Try without :latest tag
  const withoutLatest = modelName.replace(':latest', '')
  if (modelRankings[withoutLatest]) {
    return modelRankings[withoutLatest]
  }
  
  // Try partial match for base name
  for (const [key, value] of Object.entries(modelRankings)) {
    const baseName = key.split(':')[0].split('/').pop() || key
    const modelBase = modelName.split(':')[0].split('/').pop() || modelName
    if (baseName.toLowerCase().includes(modelBase.toLowerCase()) || 
        modelBase.toLowerCase().includes(baseName.toLowerCase())) {
      return value
    }
  }
  
  // Default for unknown models
  return { rank: 99, stars: '☆☆☆☆☆' }
}

// Create sorted models with ranking display
const rankedModels = computed(() => {
  return [...availableModels.value]
    .map(model => ({
      ...model,
      ranking: getModelRanking(model.name)
    }))
    .sort((a, b) => a.ranking.rank - b.ranking.rank)
    .map((model, index) => ({
      ...model,
      displayName: `${index + 1}. ${model.ranking.stars} ${model.name}`
    }))
})

const performRefreshModel = async () => {
  refreshingModel.value = true
  await Promise.all([refreshModels(), sleep(1000)])

  refreshModels().then(() => {
    refreshingModel.value = false
  })
}

const handleModelChange = (event: Event) => {
  const wip = event.target as HTMLSelectElement
  console.log('switch', wip.value)
  switchModel(wip.value)
}

type Props = {
  disabled?: boolean
}
const { disabled = false } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-row text-gray-900 dark:text-gray-100">
    <div class="inline-flex items-center gap-2">
      <select
        :disabled="disabled"
        :value="activeChat?.model ?? currentModel"
        @change="handleModelChange"
        class="w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100"
        style="min-width: 400px;"
      >
        <option :value="undefined" disabled selected>Select a model</option>
        <option v-for="model in rankedModels" :value="model.name">
          {{ model.displayName }}
        </option>
      </select>

      <button
        :disabled="disabled"
        title="Refresh available models"
        @click="performRefreshModel"
        class="inline-flex items-center justify-center rounded-lg border-none bg-gray-100 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100"
      >
        <IconRefresh
          class="h-4 w-4 -scale-100 text-white"
          :class="{ 'animate-spin': refreshingModel }"
        />
      </button>
    </div>
  </div>
</template>
