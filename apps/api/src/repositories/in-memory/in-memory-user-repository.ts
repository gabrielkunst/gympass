import { randomUUID } from 'node:crypto'

import { Prisma, User } from '@prisma/client'

import { UserRepository } from '../user-repository'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      role: 'ADMIN',
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      deletedAt: null,
    }

    this.users.push(user)

    return user
  }

  async findById(id: string) {
    const userFromDb = this.users.find((user) => user.id === id)

    if (!userFromDb) {
      return null
    }

    return userFromDb
  }

  async findByEmail(email: string) {
    const userFromDb = this.users.find((user) => user.email === email)

    if (!userFromDb) {
      return null
    }

    return userFromDb
  }
}
