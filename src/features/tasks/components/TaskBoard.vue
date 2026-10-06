<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../../../components/BaseButton.vue'
import BaseInput from '../../../components/BaseInput.vue'
import BaseModal from '../../../components/BaseModal.vue'
import BaseSelect from '../../../components/BaseSelect.vue'
import { useAdminStore } from '../../../stores/adminStore'
import type { Task } from '../../../services/taskService'
import { getCurrentUserRole, hasPermission } from '../../../utils/permissions'

const adminStore = useAdminStore()
const userRole = computed(() => getCurrentUserRole())
const canManageTasks = computed(() => hasPermission('manage_tasks', userRole.value))
const tasks = computed(() => adminStore.tasks)
const modalOpen = ref(false)
const isEditing = ref(false)
const searchTerm = ref('')
const errors = ref<Record<string, string>>({})
const form = ref({
  id: 0,
  title: '',
  assignee: '',
  priority: 'Medium' as 'High' | 'Medium' | 'Low',
  status: 'Pending' as 'Pending' | 'In Progress' | 'Completed',
  dueDate: '',
})

const filteredTasks = computed(() => {
  if (!searchTerm.value.trim()) return tasks.value
  const term = searchTerm.value.toLowerCase()
  return tasks.value.filter((task) =>
    task.title.toLowerCase().includes(term) ||
    task.assignee.toLowerCase().includes(term),
  )
})

const statusColors: Record<Task['status'], string> = {
  Pending: 'bg-amber-50 text-amber-600',
  'In Progress': 'bg-sky-50 text-sky-600',
  Completed: 'bg-emerald-50 text-emerald-600',
}

const priorityColors: Record<Task['priority'], string> = {
  High: 'text-rose-600',
  Medium: 'text-amber-600',
  Low: 'text-emerald-600',
}

const priorityOptions = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
]

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
]

const resetForm = () => {
  form.value = {
    id: 0,
    title: '',
    assignee: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  }
  errors.value = {}
}

const openCreateTask = () => {
  isEditing.value = false
  resetForm()
  modalOpen.value = true
}

const openEditTask = (task: Task) => {
  isEditing.value = true
  form.value = { ...task }
  modalOpen.value = true
}

const validateTask = () => {
  const nextErrors: Record<string, string> = {}

  if (!form.value.title.trim()) nextErrors.title = 'Task title is required.'
  if (!form.value.assignee.trim()) nextErrors.assignee = 'Assignee is required.'
  if (!form.value.dueDate) nextErrors.dueDate = 'Due date is required.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const saveTask = async () => {
  if (!validateTask()) return

  if (isEditing.value) {
    await adminStore.updateTask({ ...form.value })
  } else {
    await adminStore.addTask({
      title: form.value.title,
      assignee: form.value.assignee,
      priority: form.value.priority,
      status: form.value.status,
      dueDate: form.value.dueDate,
    })
  }

  modalOpen.value = false
  resetForm()
}

const deleteTask = async (id: number) => {
  const task = tasks.value.find((item) => item.id === id)
  if (!task) return

  const confirmed = window.confirm(`Delete task "${task.title}"?`)
  if (!confirmed) return

  await adminStore.deleteTask(id)
}

onMounted(() => {
  adminStore.loadAll()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">Operations</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-800">Tasks</h1>
      </div>
      <BaseButton v-if="canManageTasks" type="button" @click="openCreateTask">+ Add Task</BaseButton>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div class="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
        <span>🔎</span>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search tasks..."
          class="w-full bg-transparent text-sm text-slate-700 outline-none"
          aria-label="Search tasks"
        />
      </div>

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-slate-800">{{ task.title }}</h3>
              <p class="mt-1 text-sm text-slate-500">Assigned to {{ task.assignee }}</p>
            </div>
            <span :class="statusColors[task.status]" class="rounded-full px-2 py-1 text-xs font-semibold">
              {{ task.status }}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between text-sm">
            <span class="font-medium text-slate-500">Priority</span>
            <span :class="priorityColors[task.priority]" class="font-semibold">{{ task.priority }}</span>
          </div>

          <div class="mt-2 flex items-center justify-between text-sm">
            <span class="font-medium text-slate-500">Due</span>
            <span class="text-slate-700">{{ task.dueDate }}</span>
          </div>

          <div v-if="canManageTasks" class="mt-5 flex items-center justify-end gap-2">
            <button type="button" @click="openEditTask(task)" class="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">Edit</button>
            <button type="button" @click="deleteTask(task.id)" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="modalOpen" :title="isEditing ? 'Edit Task' : 'Add Task'">
      <div class="space-y-4">
        <BaseInput v-model="form.title" label="Task Title" :error="errors.title" />
        <BaseInput v-model="form.assignee" label="Assignee" :error="errors.assignee" />

        <div class="grid gap-4 md:grid-cols-2">
          <BaseSelect v-model="form.priority" label="Priority" :options="priorityOptions" />
          <BaseSelect v-model="form.status" label="Status" :options="statusOptions" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-600">Due Date</label>
          <input v-model="form.dueDate" type="date" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-400" />
          <p v-if="errors.dueDate" class="mt-1 text-xs text-rose-500">{{ errors.dueDate }}</p>
        </div>
      </div>

      <div v-if="canManageTasks" class="mt-6 flex justify-end gap-3">
        <BaseButton variant="secondary" type="button" @click="modalOpen = false">Cancel</BaseButton>
        <BaseButton type="button" @click="saveTask">{{ isEditing ? 'Update Task' : 'Save Task' }}</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
