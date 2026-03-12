<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import ChatView from '@/components/chat/ChatView.vue'
import ConnectionStatus from '@/components/settings/ConnectionStatus.vue'

const ui = useUiStore()
</script>

<template>
  <div class="flex h-full bg-surface-0">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="ui.isMobile && ui.sidebarOpen"
        class="fixed inset-0 z-30 bg-black/50"
        @click="ui.closeSidebar()"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide-sidebar">
      <aside
        v-show="ui.sidebarOpen"
        :class="[
          'flex h-full flex-col border-r border-[var(--color-border)] bg-surface-1',
          ui.isMobile
            ? 'fixed inset-y-0 left-0 z-40 w-80'
            : 'relative w-80 flex-shrink-0',
        ]"
      >
        <Sidebar />
      </aside>
    </Transition>

    <!-- Main content -->
    <main class="relative flex min-w-0 flex-1 flex-col">
      <ChatView />
    </main>

    <!-- Connection status indicator -->
    <ConnectionStatus />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: transform var(--transition-slow);
}
.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  transform: translateX(-100%);
}
</style>
