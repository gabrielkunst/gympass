import { User } from '@prisma/client'
import { UserRepository } from '../repositories/user-repository'
import { hash } from 'bcryptjs'

type RegisterUseCaseParams = {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'MEMBER'
}

type RegisterUseCaseReturn = {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
    role,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseReturn> {
    const userFromDb = await this.userRepository.findByEmail(email)

    if (userFromDb) {
      throw new Error('Email already in use.')
    }

    const passwordHash = await hash(password, 6)
    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      role,
    })

    return {
      user,
    }
  }
}
