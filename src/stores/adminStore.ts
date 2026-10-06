import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { roleService, type Role } from '../services/roleService'
import { taskService, type Task } from '../services/taskService'
import { userService, type User } from '../services/userService'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const roles = ref<Role[]>([])
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  const totalUsers = computed(() => users.value.length)
  const totalRoles = computed(() => roles.value.length)
  const totalTasks = computed(() => tasks.value.length)

  const loadAll = async () => {
    loading.value = true
    try {
      users.value = await userService.getAll()
      roles.value = await roleService.getAll()
      tasks.value = await taskService.getAll()
    } finally {
      loading.value = false
    }
  }

  const addUser = async (payload: Omit<User, 'id'>) => {
    const created = await userService.create(payload as User)
    users.value = [created, ...users.value]
    return created
  }

  const updateUser = async (payload: User) => {
    const updated = await userService.update(payload.id, payload)
    users.value = users.value.map((item) => (item.id === updated.id ? updated : item))
    return updated
  }

  const deleteUser = async (id: number) => {
    await userService.remove(id)
    users.value = users.value.filter((item) => item.id !== id)
  }

  const addRole = async (payload: Omit<Role, 'id'>) => {
    const created = await roleService.create(payload as Role)
    roles.value = [created, ...roles.value]
    return created
  }

  const updateRole = async (payload: Role) => {
    const updated = await roleService.update(payload.id, payload)
    roles.value = roles.value.map((item) => (item.id === updated.id ? updated : item))
    return updated
  }

  const deleteRole = async (id: number) => {
    await roleService.remove(id)
    roles.value = roles.value.filter((item) => item.id !== id)
  }

  const addTask = async (payload: Omit<Task, 'id'>) => {
    const created = await taskService.create(payload as Task)
    tasks.value = [created, ...tasks.value]
    return created
  }

  const updateTask = async (payload: Task) => {
    const updated = await taskService.update(payload.id, payload)
    tasks.value = tasks.value.map((item) => (item.id === updated.id ? updated : item))
    return updated
  }

  const deleteTask = async (id: number) => {
    await taskService.remove(id)
    tasks.value = tasks.value.filter((item) => item.id !== id)
  }

  return {
    users,
    roles,
    tasks,
    loading,
    totalUsers,
    totalRoles,
    totalTasks,
    loadAll,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    addTask,
    updateTask,
    deleteTask,
  }
})
