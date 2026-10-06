<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
  }>(),
  {
    modelValue: false,
    title: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
    <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 class="text-2xl font-bold text-slate-800">{{ title }}</h2>
        <button type="button" @click="emit('update:modelValue', false)" class="text-xl text-slate-400">×</button>
      </div>
      <slot />
    </div>
  </div>
</template>
