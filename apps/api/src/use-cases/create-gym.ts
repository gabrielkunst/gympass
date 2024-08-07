import { Gym } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { GymRepository } from '../repositories/gym-repository'

type CreateGymUseCaseParams = {
  name: string
  description?: string
  latitude: number
  longitude: number
}

type CreateGymUseCaseReturn = {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private readonly gymRepository: GymRepository) {}

  async execute(data: CreateGymUseCaseParams): Promise<CreateGymUseCaseReturn> {
    const gym = await this.gymRepository.create(data)

    return { gym }
  }
}
