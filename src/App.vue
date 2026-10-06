<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DashboardView from './features/dashboard/views/DashboardView.vue'
import UserTable from './features/users/components/UserTable.vue'
import RolesTable from './features/roles/components/RolesTable.vue'
import SettingsPanel from './features/settings/components/SettingsPanel.vue'
import TaskBoard from './features/tasks/components/TaskBoard.vue'
import {
  availableRoles,
  getCurrentUserRole,
  hasPermission,
  setCurrentUserRole,
  type AppRole,
} from './utils/permissions'

const userRole = ref<AppRole>(getCurrentUserRole())

watch(
  userRole,
  (role) => {
    setCurrentUserRole(role)
  },
  { immediate: true },
)

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌂', permission: 'view_dashboard' as const },
  { id: 'users', label: 'Users', icon: '👤', permission: 'view_users' as const },
  { id: 'roles', label: 'Roles', icon: '🔐', permission: 'view_roles' as const },
  { id: 'tasks', label: 'Tasks', icon: '📋', permission: 'view_tasks' as const },
  { id: 'settings', label: 'Settings', icon: '⚙️', permission: 'view_settings' as const },
]

const visibleNavItems = computed(() =>
  navItems.filter((item) => hasPermission(item.permission, userRole.value)),
)

const activeTab = ref('dashboard')

const renderView = () => {
  if (!hasPermission('view_dashboard', userRole.value) && activeTab.value === 'dashboard') {
    activeTab.value = 'tasks'
  }

  switch (activeTab.value) {
    case 'dashboard':
      return hasPermission('view_dashboard', userRole.value) ? DashboardView : TaskBoard
    case 'users':
      return hasPermission('view_users', userRole.value) ? UserTable : DashboardView
    case 'roles':
      return hasPermission('view_roles', userRole.value) ? RolesTable : DashboardView
    case 'tasks':
      return hasPermission('view_tasks', userRole.value) ? TaskBoard : DashboardView
    case 'settings':
      return hasPermission('view_settings', userRole.value) ? SettingsPanel : DashboardView
    default:
      return DashboardView
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <div class="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
      <aside class="w-full bg-slate-900 text-slate-200 lg:w-72 lg:min-h-screen">
        <div class="flex items-center justify-between border-b border-slate-700 p-5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-bold text-white">B</div>
            <div>
              <p class="text-lg font-bold text-white">BESA</p>
              <p class="text-xs text-slate-400">Life Safety</p>
            </div>
          </div>
        </div>

        <nav class="space-y-2 p-4">
          <button
            v-for="item in visibleNavItems"
            :key="item.id"
            type="button"
            @click="activeTab = item.id"
            :class="[
              'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition',
              activeTab === item.id
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ]"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-base">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </nav>

        <div class="mt-auto border-t border-slate-700 p-4">
          <p class="text-xs text-slate-400">© 2026 BESA Life Safety</p>
          <p class="mt-1 text-xs text-slate-500">All rights reserved.</p>
        </div>
      </aside>

      <main class="flex-1 bg-slate-100 p-4 md:p-6 xl:p-8">
        <header class="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
              <span>🔍</span>
              <input
                type="text"
                value="Search here..."
                class="w-full bg-transparent text-sm outline-none md:w-64"
                aria-label="Search here"
              />
            </div>

            <div class="flex items-center gap-3 self-end md:self-auto">
              <button class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg">🔔</button>
              <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 font-bold text-white">P</div>
                <div class="hidden sm:block">
                  <p class="text-sm font-semibold text-slate-700">Prasad Nalawade</p>
                  <p class="text-xs text-slate-500">{{ userRole }}</p>
                </div>
                <select v-model="userRole" class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none">
                  <option v-for="role in availableRoles" :key="role" :value="role">{{ role }}</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <component :is="renderView()" />
      </main>
    </div>
  </div>
</template>