<script setup lang="ts">
defineProps<{
  label: string
  value: string
  change: string
  positive?: boolean
  icon: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ label }}</p>
        <div class="mt-3 flex items-end gap-2">
          <h3 class="text-3xl font-bold text-slate-800">{{ value }}</h3>
          <span
            :class="positive ? 'text-emerald-500' : 'text-slate-500'"
            class="text-xs font-semibold"
          >
            {{ change }}
          </span>
        </div>
      </div>

      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-xl text-sky-600"
      >
        {{ icon }}
      </div>
    </div>
  </div>
</template>
