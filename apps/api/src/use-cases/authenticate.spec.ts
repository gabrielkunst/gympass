import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { UserRepository } from '../repositories/user-repository'
import { hash } from 'bcryptjs'

type CreateSutReturn = {
  sut: AuthenticateUseCase
  userRepository: UserRepository
}

function createSut(): CreateSutReturn {
  const userRepository = new InMemoryUserRepository()
  const sut = new AuthenticateUseCase(userRepository)

  return { sut, userRepository }
}

describe('Authenticate Use Case', () => {
  it('should throw an error if user does not exist', async () => {
    const { sut } = createSut()

    await expect(() =>
      sut.execute({
        email: 'non_existing_email',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it('should throw an error if passwords dont match', async () => {
    const { sut, userRepository } = createSut()

    const email = faker.internet.email()

    await userRepository.create({
      name: faker.person.fullName(),
      email,
      passwordHash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'invalid_password',
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it('should return an user if authentication is successful', async () => {
    const { sut, userRepository } = createSut()

    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
    }

    await userRepository.create({
      name: userData.name,
      email: userData.email,
      passwordHash: await hash(userData.password, 6),
    })

    const { user } = await sut.execute({
      email: userData.email,
      password: userData.password,
    })

    expect(user.id).toBeTruthy()
  })
})
