import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { UserRepository } from '../repositories/user-repository'
import { compare, hash } from 'bcryptjs'

type CreateSutReturn = {
  sut: RegisterUseCase
  userRepository: UserRepository
}

function createSut(): CreateSutReturn {
  const userRepository = new InMemoryUserRepository()
  const sut = new RegisterUseCase(userRepository)

  return { sut, userRepository }
}

describe('Register Use Case', () => {
  it('should throw an error if user already exists', async () => {
    const { sut, userRepository } = createSut()

    const email = faker.internet.email()
    const passwordHash = await hash(faker.internet.password(), 6)

    await userRepository.create({
      name: faker.person.fullName(),
      email,
      passwordHash,
      role: 'ADMIN',
    })

    await expect(() =>
      sut.execute({
        name: faker.person.fullName(),
        email,
        password: faker.internet.password(),
        role: 'ADMIN',
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to register', async () => {
    const { sut } = createSut()

    const { user } = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'ADMIN',
    })

    expect(user.id).toBeTruthy()
  })

  it('should hash user password', async () => {
    const { sut } = createSut()

    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'ADMIN' as 'ADMIN' | 'MEMBER',
    }

    const { user } = await sut.execute(userData)

    const doesPasswordsMatches = await compare(
      userData.password,
      user.passwordHash
    )

    expect(doesPasswordsMatches).toBe(true)
  })
})
