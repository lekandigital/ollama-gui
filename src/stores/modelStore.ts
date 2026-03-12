import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { OllamaModel } from '@/types/ollama'
import { listModels } from '@/services/ollama'

const MODEL_RANKINGS: Record<string, { rank: number; stars: string }> = {
  'behemoth-123b': { rank: 1, stars: '\u2605\u2605\u2605\u2605\u2605' },
  'huihui_ai/qwen3-abliterated:30b-a3b': { rank: 2, stars: '\u2605\u2605\u2605\u2605\u2605' },
  'qwen3-uncensored': { rank: 3, stars: '\u2605\u2605\u2605\u2605\u2605' },
  'huihui_ai/gemma3-abliterated:27b': { rank: 4, stars: '\u2605\u2605\u2605\u2605\u2606' },
  'gemma3-uncensored': { rank: 5, stars: '\u2605\u2605\u2605\u2605\u2606' },
  'huihui_ai/phi4-abliterated': { rank: 6, stars: '\u2605\u2605\u2605\u2605\u2606' },
  'phi4-uncensored': { rank: 7, stars: '\u2605\u2605\u2605\u2605\u2606' },
  'huihui_ai/nemotron-abliterated': { rank: 8, stars: '\u2605\u2605\u2605\u2605\u2606' },
  'mixtral:8x7b': { rank: 9, stars: '\u2605\u2605\u2605\u2605\u2606' },
  'huihui_ai/glm-4.7-flash-abliterated': { rank: 10, stars: '\u2605\u2605\u2605\u2606\u2606' },
  'glm4-uncensored': { rank: 11, stars: '\u2605\u2605\u2605\u2606\u2606' },
  'huihui_ai/gpt-oss-abliterated': { rank: 12, stars: '\u2605\u2605\u2605\u2606\u2606' },
  'mistral:latest': { rank: 13, stars: '\u2605\u2605\u2605\u2606\u2606' },
  'Godmoded/llama3-lexi-uncensored': { rank: 14, stars: '\u2605\u2605\u2605\u2606\u2606' },
  'falcon:7b': { rank: 15, stars: '\u2605\u2605\u2606\u2606\u2606' },
  'Malicus7862/thebloke-luna-ai-llama2-uncensored-gguf': {
    rank: 16,
    stars: '\u2605\u2605\u2606\u2606\u2606',
  },
}

function getModelRanking(modelName: string): { rank: number; stars: string } {
  if (MODEL_RANKINGS[modelName]) return MODEL_RANKINGS[modelName]

  const withoutTag = modelName.replace(/:latest$/, '')
  if (MODEL_RANKINGS[withoutTag]) return MODEL_RANKINGS[withoutTag]

  for (const [key, value] of Object.entries(MODEL_RANKINGS)) {
    const baseName = key.split(':')[0].split('/').pop() || key
    const modelBase = modelName.split(':')[0].split('/').pop() || modelName
    if (
      baseName.toLowerCase().includes(modelBase.toLowerCase()) ||
      modelBase.toLowerCase().includes(baseName.toLowerCase())
    ) {
      return value
    }
  }

  return { rank: 99, stars: '\u2606\u2606\u2606\u2606\u2606' }
}

export interface RankedModel extends OllamaModel {
  ranking: { rank: number; stars: string }
  displayName: string
}

export const useModelStore = defineStore('models', () => {
  const models = ref<OllamaModel[]>([])
  const currentModel = useLocalStorage('currentModel', 'none')
  const isLoading = ref(false)

  const rankedModels = computed<RankedModel[]>(() => {
    return [...models.value]
      .map((model) => ({
        ...model,
        ranking: getModelRanking(model.name),
        displayName: '',
      }))
      .sort((a, b) => a.ranking.rank - b.ranking.rank)
      .map((model, index) => ({
        ...model,
        displayName: `${index + 1}. ${model.ranking.stars} ${model.name}`,
      }))
  })

  async function refresh() {
    isLoading.value = true
    try {
      const response = await listModels()
      models.value = response.models
    } catch (err) {
      console.error('Failed to fetch models:', err)
    } finally {
      isLoading.value = false
    }
  }

  function formatSize(bytes: number): string {
    const gb = bytes / 1024 / 1024 / 1024
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(gb * 1024).toFixed(0)} MB`
  }

  return {
    models,
    currentModel,
    isLoading,
    rankedModels,
    refresh,
    formatSize,
  }
})
