<script setup lang="ts">
import { useCounterStore } from './stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
      <h1 class="mb-6 text-2xl font-bold text-gray-800">
        Vue 3 + TypeScript + Pinia
      </h1>

      <p class="mb-2 text-5xl font-bold text-blue-600">
        {{ counter.count }}
      </p>

      <p class="mb-6 text-gray-500">
        Double: {{ counter.doubleCount }}
      </p>

      <div class="flex justify-center gap-3">
        <button
          @click="counter.decrement"
          class="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600"
        >
          -
        </button>

        <button
          @click="counter.increment"
          class="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          +
        </button>

        <button
          @click="counter.reset"
          class="rounded-lg bg-gray-600 px-5 py-2 text-white hover:bg-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>