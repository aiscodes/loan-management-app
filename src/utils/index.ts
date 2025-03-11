import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getLoans = async function () {
  try {
    const loans = await prisma.loan.findMany()
    prisma.$disconnect()
    return loans
  } catch {
    return []
  }
}

export const calculateAPR = function (duration: number) {
  const baseAPR = 7
  const maxAPR = 20

  const apr = baseAPR + ((duration - 12) / (60 - 12)) * (maxAPR - baseAPR)

  return Math.min(Math.max(apr, baseAPR), maxAPR) // Ограничиваем диапазон
}
