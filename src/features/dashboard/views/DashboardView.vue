<script setup lang="ts">
import StatCard from '../components/StatCard.vue'

const stats = [
  { label: 'Total Users', value: '120', change: '+12% this month', positive: true, icon: '👥' },
  { label: 'Total Roles', value: '8', change: '+0%', positive: true, icon: '🛡️' },
  { label: 'Total Tasks', value: '45', change: '-8% from last month', positive: false, icon: '✅' },
  { label: 'Completed Tasks', value: '32', change: '+16% completion rate', positive: true, icon: '📊' },
]

const userRegistration = [
  { label: 'Jan', value: 28 },
  { label: 'Feb', value: 36 },
  { label: 'Mar', value: 40 },
  { label: 'Apr', value: 52 },
  { label: 'May', value: 48 },
  { label: 'Jun', value: 55 },
  { label: 'Jul', value: 63 },
]

const userRoles = [
  { name: 'Admin', percentage: 42, color: 'bg-sky-500' },
  { name: 'Manager', percentage: 30, color: 'bg-emerald-500' },
  { name: 'User', percentage: 28, color: 'bg-amber-400' },
]

const taskPriority = [
  { label: 'High', value: 45, color: 'from-emerald-500 to-green-400' },
  { label: 'Medium', value: 20, color: 'from-sky-500 to-cyan-400' },
  { label: 'Low', value: 15, color: 'from-orange-400 to-amber-300' },
]

const growth = [
  { label: 'Jan', value: 20 },
  { label: 'Feb', value: 22 },
  { label: 'Mar', value: 35 },
  { label: 'Apr', value: 28 },
  { label: 'May', value: 42 },
  { label: 'Jun', value: 50 },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">Overview</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-800">Dashboard</h1>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-600"
      >
        Export Report
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="item in stats"
        :key="item.label"
        :label="item.label"
        :value="item.value"
        :change="item.change"
        :positive="item.positive"
        :icon="item.icon"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-3">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800">User Registration</h2>
          <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
            Monthly
          </span>
        </div>

        <div class="flex h-48 items-end gap-3">
          <div
            v-for="point in userRegistration"
            :key="point.label"
            class="flex flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              class="w-full rounded-t-2xl bg-gradient-to-t from-sky-600 to-cyan-400"
              :style="{ height: `${point.value}%` }"
            />
            <span class="text-xs font-medium text-slate-500">{{ point.label }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800">Task Status</h2>
        </div>

        <div class="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#14b8a6_0_42%,#fbbf24_42%_78%,#38bdf8_78%_100%)]">
          <div class="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <span class="text-3xl font-bold text-slate-800">45</span>
            <span class="text-xs text-slate-500">Tasks</span>
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div v-for="item in userRoles" :key="item.name" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span :class="item.color" class="inline-block h-3 w-3 rounded-full"></span>
              <span class="text-sm text-slate-600">{{ item.name }}</span>
            </div>
            <span class="text-sm font-semibold text-slate-700">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-xl font-bold text-slate-800">Tasks by Priority</h2>
        <div class="mt-6 space-y-4">
          <div v-for="task in taskPriority" :key="task.label">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium text-slate-600">{{ task.label }}</span>
              <span class="font-semibold text-slate-800">{{ task.value }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-slate-100">
              <div
                :class="task.color"
                class="h-2.5 rounded-full bg-gradient-to-r"
                :style="{ width: `${task.value}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800">User Growth</h2>
        </div>

        <div class="flex h-48 items-end gap-3">
          <div
            v-for="point in growth"
            :key="point.label"
            class="flex flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              class="w-full rounded-t-2xl bg-gradient-to-t from-blue-500 to-sky-300"
              :style="{ height: `${point.value}%` }"
            />
            <span class="text-xs font-medium text-slate-500">{{ point.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
