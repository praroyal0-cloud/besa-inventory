import { api } from './api'

export type Profile = {
  name: string
  email: string
  phone: string
  role: string
}

const defaultProfile: Profile = {
  name: 'Prasad Nalawade',
  email: 'prasad@example.com',
  phone: '+91 98765 43210',
  role: 'Admin',
}

export const settingsService = {
  async getProfile(): Promise<Profile> {
    try {
      const response = await api.get<Profile>('/profile')
      return response.data
    } catch (error) {
      console.warn('Settings API fallback:', error)
      return { ...defaultProfile }
    }
  },

  async updateProfile(payload: Profile): Promise<Profile> {
    try {
      const response = await api.put<Profile>('/profile', payload)
      return response.data
    } catch (error) {
      console.warn('Settings update fallback:', error)
      return { ...payload }
    }
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<boolean> {
    try {
      const response = await api.post<boolean>('/profile/change-password', data)
      return response.data
    } catch (error) {
      console.warn('Password change fallback:', error)
      return true
    }
  },

  async sendInvite(data: { name: string; email: string; role: string }): Promise<boolean> {
    try {
      const response = await api.post<boolean>('/profile/invite', data)
      return response.data
    } catch (error) {
      console.warn('Invite fallback:', error)
      return true
    }
  },
}
