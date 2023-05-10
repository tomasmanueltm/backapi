import { PrismaClient, usuario } from '@prisma/client'
const prismaClient = new PrismaClient()

export {prismaClient, usuario};