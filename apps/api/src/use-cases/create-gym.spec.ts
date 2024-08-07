import { describe, it, expect } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymRepository } from '../repositories/in-memory/in-memory-gym-repository'

type CreateSutReturn = {
  sut: CreateGymUseCase
}

function createSut(): CreateSutReturn {
  const gymRepository = new InMemoryGymRepository()
  const sut = new CreateGymUseCase(gymRepository)

  return { sut }
}

describe('Create Gym Use Case', () => {
  it('should create a gym', async () => {
    const { sut } = createSut()

    const { gym } = await sut.execute({
      name: 'Gym',
      description: 'Description',
      latitude: 0,
      longitude: 0,
    })

    expect(gym.id).toBeTruthy()
  })
})
