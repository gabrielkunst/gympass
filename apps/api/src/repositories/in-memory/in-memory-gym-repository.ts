import { Prisma, Gym } from '@prisma/client'
import { GymRepository } from '../gym-repository'
import { randomUUID } from 'crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymRepository implements GymRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: randomUUID(),
      name: data.name,
      description: data.description || null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      createdAt: new Date(),
      deletedAt: null,
    }

    this.gyms.push(gym)

    return gym
  }
  async findById(id: string) {
    const gymByDb = this.gyms.find((gym) => gym.id === id)

    if (!gymByDb) {
      return null
    }

    return gymByDb
  }
}
