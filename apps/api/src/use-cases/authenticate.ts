import { compare } from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'
import { User } from '@prisma/client'

type AuthenticateUseCaseParams = {
  email: string
  password: string
}

type AuthenticateUseCaseReturn = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseReturn> {
    const userFromDb = await this.userRepository.findByEmail(email)

    if (!userFromDb) {
      throw new Error('Invalid credentials.')
    }

    const doesPasswordsMatches = await compare(
      password,
      userFromDb.passwordHash
    )

    if (!doesPasswordsMatches) {
      throw new Error('Invalid credentials.')
    }

    return { user: userFromDb }
  }
}
