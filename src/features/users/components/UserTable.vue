<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../../../components/BaseButton.vue'
import BaseInput from '../../../components/BaseInput.vue'
import BaseModal from '../../../components/BaseModal.vue'
import BaseSelect from '../../../components/BaseSelect.vue'
import { useAdminStore } from '../../../stores/adminStore'
import type { User } from '../../../services/userService'
import { getCurrentUserRole, hasPermission } from '../../../utils/permissions'

const adminStore = useAdminStore()
const userRole = computed(() => getCurrentUserRole())

const canManageUsers = computed(() => hasPermission('manage_users', userRole.value))

const users = computed(() => adminStore.users)
const searchTerm = ref('')
const modalOpen = ref(false)
const isEditing = ref(false)
const form = ref({
  id: 0,
  name: '',
  email: '',
  role: 'Manager',
  date: '',
  status: 'Active' as 'Active' | 'Inactive',
})
const errors = ref<Record<string, string>>({})

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Developer', value: 'Developer' },
  { label: 'Analyst', value: 'Analyst' },
]

const filteredUsers = computed(() => {
  if (!searchTerm.value.trim()) return users.value
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term),
  )
})

const resetForm = () => {
  form.value = {
    id: 0,
    name: '',
    email: '',
    role: 'Manager',
    date: '',
    status: 'Active',
  }
  errors.value = {}
}

const openNewUser = () => {
  isEditing.value = false
  resetForm()
  modalOpen.value = true
}

const openEditUser = (user: User) => {
  isEditing.value = true
  form.value = { ...user }
  modalOpen.value = true
}

const validateUser = () => {
  const nextErrors: Record<string, string> = {}

  if (!form.value.name.trim()) nextErrors.name = 'Name is required.'
  if (!form.value.email.trim()) {
    nextErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    nextErrors.email = 'Enter a valid email address.'
  }
  if (!form.value.date) nextErrors.date = 'Date is required.'
  if (!form.value.role.trim()) nextErrors.role = 'Role is required.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const saveUser = async () => {
  if (!validateUser()) return

  if (isEditing.value) {
    await adminStore.updateUser({ ...form.value })
  } else {
    await adminStore.addUser({
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      date: form.value.date,
      status: form.value.status,
    })
  }

  modalOpen.value = false
  resetForm()
}

const deleteUser = async (id: number) => {
  const user = users.value.find((item) => item.id === id)
  if (!user) return

  const confirmed = window.confirm(`Delete ${user.name}?`)
  if (!confirmed) return

  await adminStore.deleteUser(id)
}

onMounted(() => {
  adminStore.loadAll()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">Management</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-800">Users</h1>
      </div>
      <BaseButton v-if="canManageUsers" type="button" @click="openNewUser">+ Invite User</BaseButton>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
          <span>🔎</span>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search users..."
            class="w-full bg-transparent text-sm text-slate-700 outline-none md:w-60"
            aria-label="Search users"
          />
        </div>
        <BaseButton variant="secondary" type="button">Filter</BaseButton>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-slate-500">
              <th class="px-3 py-3 font-medium">ID</th>
              <th class="px-3 py-3 font-medium">Name</th>
              <th class="px-3 py-3 font-medium">Role</th>
              <th class="px-3 py-3 font-medium">Date of Birth</th>
              <th class="px-3 py-3 font-medium">Status</th>
              <th class="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-slate-100 last:border-b-0">
              <td class="px-3 py-4 text-slate-600">{{ user.id }}</td>
              <td class="px-3 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-700">{{ user.name }}</p>
                    <p class="text-xs text-slate-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-3 py-4 text-slate-600">{{ user.role }}</td>
              <td class="px-3 py-4 text-slate-600">{{ user.date }}</td>
              <td class="px-3 py-4">
                <span
                  :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-3 py-4">
                <div class="flex items-center gap-2">
                  <button
                    v-if="canManageUsers"
                    type="button"
                    @click="openEditUser(user)"
                    class="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-sky-200 hover:text-sky-600"
                  >
                    ✏️
                  </button>
                  <button
                    v-if="canManageUsers"
                    type="button"
                    @click="deleteUser(user.id)"
                    class="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-500 hover:bg-rose-100"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="modalOpen" :title="isEditing ? 'Edit User' : 'Invite User'">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <BaseInput v-model="form.name" label="Full Name" :error="errors.name" />
        </div>

        <div class="md:col-span-2">
          <BaseInput v-model="form.email" label="Email" type="email" :error="errors.email" />
        </div>

        <BaseSelect v-model="form.role" label="Role" :options="roleOptions" :error="errors.role" />

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-600">Date</label>
          <input v-model="form.date" type="date" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-400" />
          <p v-if="errors.date" class="mt-1 text-xs text-rose-500">{{ errors.date }}</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-600">Status</label>
          <select v-model="form.status" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-400">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div v-if="canManageUsers" class="mt-6 flex justify-end gap-3">
        <BaseButton variant="secondary" type="button" @click="modalOpen = false">Cancel</BaseButton>
        <BaseButton type="button" @click="saveUser">{{ isEditing ? 'Update User' : 'Save User' }}</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
