<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../../../components/BaseButton.vue'
import BaseInput from '../../../components/BaseInput.vue'
import BaseModal from '../../../components/BaseModal.vue'
import { useAdminStore } from '../../../stores/adminStore'
import type { Role } from '../../../services/roleService'
import { getCurrentUserRole, hasPermission } from '../../../utils/permissions'

const adminStore = useAdminStore()
const userRole = computed(() => getCurrentUserRole())
const canManageRoles = computed(() => hasPermission('manage_roles', userRole.value))
const roles = computed(() => adminStore.roles)
const searchTerm = ref('')
const modalOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, name: '', description: '', users: 0, createdAt: '' })
const errors = ref<Record<string, string>>({})

const filteredRoles = computed(() => {
  if (!searchTerm.value.trim()) return roles.value
  const term = searchTerm.value.toLowerCase()
  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(term) ||
      role.description.toLowerCase().includes(term),
  )
})

const resetForm = () => {
  form.value = { id: 0, name: '', description: '', users: 0, createdAt: '' }
  errors.value = {}
}

const openNewRole = () => {
  isEditing.value = false
  resetForm()
  modalOpen.value = true
}

const openEditRole = (role: Role) => {
  isEditing.value = true
  form.value = { ...role }
  modalOpen.value = true
}

const validateRole = () => {
  const nextErrors: Record<string, string> = {}

  if (!form.value.name.trim()) nextErrors.name = 'Role name is required.'
  if (!form.value.description.trim()) nextErrors.description = 'Description is required.'
  if (!form.value.createdAt) nextErrors.createdAt = 'Created date is required.'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const saveRole = async () => {
  if (!validateRole()) return

  if (isEditing.value) {
    await adminStore.updateRole({ ...form.value })
  } else {
    await adminStore.addRole({
      name: form.value.name,
      description: form.value.description,
      users: Number(form.value.users) || 0,
      createdAt: form.value.createdAt,
    })
  }

  modalOpen.value = false
  resetForm()
}

const deleteRole = async (id: number) => {
  const role = roles.value.find((item) => item.id === id)
  if (!role) return

  const confirmed = window.confirm(`Delete role ${role.name}?`)
  if (!confirmed) return

  await adminStore.deleteRole(id)
}

onMounted(() => {
  adminStore.loadAll()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">Access</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-800">Roles</h1>
      </div>
      <BaseButton v-if="canManageRoles" type="button" @click="openNewRole">+ Add Role</BaseButton>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div class="mb-4 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
        <span>🔎</span>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search roles..."
          class="w-full bg-transparent text-slate-700 outline-none"
          aria-label="Search roles"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-slate-500">
              <th class="px-3 py-3 font-medium">ID</th>
              <th class="px-3 py-3 font-medium">Role Name</th>
              <th class="px-3 py-3 font-medium">Description</th>
              <th class="px-3 py-3 font-medium">Users</th>
              <th class="px-3 py-3 font-medium">Created At</th>
              <th class="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in filteredRoles" :key="role.id" class="border-b border-slate-100 last:border-b-0">
              <td class="px-3 py-4 text-slate-600">{{ role.id }}</td>
              <td class="px-3 py-4 font-semibold text-slate-700">{{ role.name }}</td>
              <td class="px-3 py-4 text-slate-600">{{ role.description }}</td>
              <td class="px-3 py-4 text-slate-600">{{ role.users }}</td>
              <td class="px-3 py-4 text-slate-600">{{ role.createdAt }}</td>
              <td class="px-3 py-4">
                <div class="flex items-center gap-2">
                  <button type="button" class="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">Permissions</button>
                  <button type="button" class="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">Users</button>
                  <button v-if="canManageRoles" type="button" @click="openEditRole(role)" class="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600">Edit</button>
                  <button v-if="canManageRoles" type="button" @click="deleteRole(role.id)" class="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="modalOpen" :title="isEditing ? 'Edit Role' : 'Add Role'">
      <div class="space-y-4">
        <BaseInput v-model="form.name" label="Role Name" :error="errors.name" />
        <BaseInput v-model="form.description" label="Description" :error="errors.description" />
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-600">Users</label>
            <input v-model.number="form.users" type="number" min="0" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-400" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-600">Created At</label>
            <input v-model="form.createdAt" type="date" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-400" />
            <p v-if="errors.createdAt" class="mt-1 text-xs text-rose-500">{{ errors.createdAt }}</p>
          </div>
        </div>
      </div>

      <div v-if="canManageRoles" class="mt-6 flex justify-end gap-3">
        <BaseButton variant="secondary" type="button" @click="modalOpen = false">Cancel</BaseButton>
        <BaseButton type="button" @click="saveRole">{{ isEditing ? 'Update Role' : 'Save Role' }}</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
