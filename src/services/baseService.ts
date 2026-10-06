import { api } from './api'

export type EntityId = number | string

export class BaseService<T extends { id?: EntityId }> {
  readonly endpoint: string
  readonly seedData: T[]

  constructor(endpoint: string, seedData: T[] = []) {
    this.endpoint = endpoint
    this.seedData = seedData
  }

  private cloneData<U>(data: U): U {
    return JSON.parse(JSON.stringify(data))
  }

  private async safeRequest<U>(request: () => Promise<U>, fallback: U): Promise<U> {
    try {
      return await request()
    } catch (error) {
      console.warn(`API fallback for ${this.endpoint}:`, error)
      return fallback
    }
  }

  async getAll(): Promise<T[]> {
    return this.safeRequest(
      async () => {
        const response = await api.get<T[]>(`/${this.endpoint}`)
        return response.data
      },
      this.cloneData(this.seedData),
    )
  }

  async create(payload: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T> {
    const item = {
      ...payload,
      id: payload.id ?? Date.now(),
    } as T

    try {
      const response = await api.post<T>(`/${this.endpoint}`, item)
      return response.data
    } catch (error) {
      console.warn(`API fallback for create ${this.endpoint}:`, error)
      this.seedData.unshift(item)
      return this.cloneData(item)
    }
  }

  async update(id: EntityId, payload: Partial<T>): Promise<T> {
    const index = this.seedData.findIndex((item) => item.id === id)

    try {
      const response = await api.put<T>(`/${this.endpoint}/${id}`, payload)
      return response.data
    } catch (error) {
      console.warn(`API fallback for update ${this.endpoint}:`, error)

      if (index === -1) {
        throw new Error(`${this.endpoint} item not found`)
      }

      const updatedItem = { ...this.seedData[index], ...payload } as T
      this.seedData[index] = updatedItem
      return this.cloneData(updatedItem)
    }
  }

  async remove(id: EntityId): Promise<void> {
    try {
      await api.delete(`/${this.endpoint}/${id}`)
    } catch (error) {
      console.warn(`API fallback for delete ${this.endpoint}:`, error)
      const index = this.seedData.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.seedData.splice(index, 1)
      }
    }
  }
}
