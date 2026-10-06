<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    options?: Array<{ label: string; value: string }>
    error?: string
  }>(),
  {
    label: '',
    options: () => [],
    error: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-slate-600">{{ label }}</label>
    <select
      :value="modelValue"
      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none transition focus:border-sky-400"
      :class="error ? 'border-rose-300 bg-rose-50' : ''"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-rose-500">{{ error }}</p>
  </div>
</template>
