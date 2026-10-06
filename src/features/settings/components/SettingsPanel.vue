<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../../../components/BaseButton.vue'
import BaseInput from '../../../components/BaseInput.vue'
import BaseSelect from '../../../components/BaseSelect.vue'
import { settingsService } from '../../../services/settingsService'
import { getCurrentUserRole, hasPermission } from '../../../utils/permissions'

const userRole = computed(() => getCurrentUserRole())
const canManageSettings = computed(() => hasPermission('manage_settings', userRole.value))
const profile = ref({
  name: 'Prasad Nalawade',
  email: 'prasad@example.com',
  phone: '+91 98765 43210',
  role: 'Admin',
})

const profileErrors = ref<Record<string, string>>({})
const profileMessage = ref('')

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordErrors = ref<Record<string, string>>({})
const passwordMessage = ref('')

const inviteForm = ref({ name: '', email: '', role: 'Manager' })
const inviteErrors = ref<Record<string, string>>({})
const inviteMessage = ref('')

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const loadProfile = async () => {
  const data = await settingsService.getProfile()
  profile.value = data
}

const saveProfile = async () => {
  const nextErrors: Record<string, string> = {}

  if (!profile.value.name.trim()) nextErrors.name = 'Name is required.'
  if (!profile.value.email.trim()) {
    nextErrors.email = 'Email is required.'
  } else if (!isValidEmail(profile.value.email)) {
    nextErrors.email = 'Enter a valid email address.'
  }
  if (!profile.value.phone.trim()) nextErrors.phone = 'Phone number is required.'

  profileErrors.value = nextErrors
  profileMessage.value = Object.keys(nextErrors).length ? '' : 'Profile updated successfully.'

  if (Object.keys(nextErrors).length) return

  await settingsService.updateProfile(profile.value)
}

const updatePassword = async () => {
  const nextErrors: Record<string, string> = {}

  if (!passwordForm.value.currentPassword) {
    nextErrors.currentPassword = 'Current password is required.'
  } else if (passwordForm.value.currentPassword !== 'admin123') {
    nextErrors.currentPassword = 'Current password is incorrect.'
  }

  if (!passwordForm.value.newPassword) {
    nextErrors.newPassword = 'New password is required.'
  } else if (passwordForm.value.newPassword.length < 8) {
    nextErrors.newPassword = 'Password must be at least 8 characters.'
  }

  if (!passwordForm.value.confirmPassword) {
    nextErrors.confirmPassword = 'Please confirm your password.'
  } else if (passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
    nextErrors.confirmPassword = 'Passwords do not match.'
  }

  passwordErrors.value = nextErrors
  passwordMessage.value = Object.keys(nextErrors).length ? '' : 'Password changed successfully.'

  if (Object.keys(nextErrors).length) return

  await settingsService.changePassword({
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword,
  })

  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

const sendInvitation = async () => {
  const nextErrors: Record<string, string> = {}

  if (!inviteForm.value.name.trim()) nextErrors.name = 'Name is required.'
  if (!inviteForm.value.email.trim()) {
    nextErrors.email = 'Email is required.'
  } else if (!isValidEmail(inviteForm.value.email)) {
    nextErrors.email = 'Enter a valid email address.'
  }

  inviteErrors.value = nextErrors
  inviteMessage.value = Object.keys(nextErrors).length ? '' : 'Invitation sent successfully.'

  if (Object.keys(nextErrors).length) return

  await settingsService.sendInvite({
    name: inviteForm.value.name,
    email: inviteForm.value.email,
    role: inviteForm.value.role,
  })

  inviteForm.value = { name: '', email: '', role: 'Manager' }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">Account</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-800">Settings</h1>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-700">P</div>
          <div>
            <h2 class="text-2xl font-bold text-slate-800">{{ profile.name }}</h2>
            <p class="text-sm text-slate-500">{{ profile.email }}</p>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <BaseInput v-model="profile.name" label="Full Name" :error="profileErrors.name" />
          <BaseInput v-model="profile.email" label="Email Address" type="email" :error="profileErrors.email" />
          <BaseInput v-model="profile.phone" label="Phone Number" :error="profileErrors.phone" />
          <BaseSelect v-model="profile.role" label="Role" :options="[
            { label: 'Admin', value: 'Admin' },
            { label: 'Manager', value: 'Manager' },
            { label: 'Developer', value: 'Developer' },
          ]" />

          <BaseButton v-if="canManageSettings" type="button" @click="saveProfile" full-width>Save Profile</BaseButton>
          <p v-if="profileMessage" class="text-sm font-medium text-emerald-600">{{ profileMessage }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-xl font-bold text-slate-800">Change Password</h2>
          <div class="mt-5 space-y-4">
            <BaseInput v-model="passwordForm.currentPassword" type="password" label="Current Password" placeholder="Enter current password" :error="passwordErrors.currentPassword" />
            <BaseInput v-model="passwordForm.newPassword" type="password" label="New Password" placeholder="Enter new password" :error="passwordErrors.newPassword" />
            <BaseInput v-model="passwordForm.confirmPassword" type="password" label="Confirm New Password" placeholder="Repeat new password" :error="passwordErrors.confirmPassword" />
            <BaseButton v-if="canManageSettings" type="button" @click="updatePassword" full-width>Update Password</BaseButton>
            <p v-if="passwordMessage" class="text-sm font-medium text-emerald-600">{{ passwordMessage }}</p>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-xl font-bold text-slate-800">Invite User</h2>
          <div class="mt-5 space-y-4">
            <BaseInput v-model="inviteForm.name" label="Name" placeholder="Enter name" :error="inviteErrors.name" />
            <BaseInput v-model="inviteForm.email" label="Email" type="email" placeholder="Enter email" :error="inviteErrors.email" />
            <BaseSelect v-model="inviteForm.role" label="Role" :options="[
              { label: 'Manager', value: 'Manager' },
              { label: 'Developer', value: 'Developer' },
              { label: 'Admin', value: 'Admin' },
            ]" />
            <BaseButton v-if="canManageSettings" type="button" variant="secondary" @click="sendInvitation" full-width>Send Invitation</BaseButton>
            <p v-if="inviteMessage" class="text-sm font-medium text-emerald-600">{{ inviteMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
