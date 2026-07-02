import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = (req as any).user
  
  const totalDemands = await prisma.demand.count()
  const pendingDemands = await prisma.demand.count({where:{status:'pending'}})
  const totalItems = await prisma.item.count()
  const totalUsers = await prisma.user.count()
  const recentAuditLogs = await prisma.auditLog.findMany({take:10, orderBy:{createdAt:'desc'}})
  
  res.json({totalDemands, pendingDemands, totalItems, totalUsers, recentAuditLogs})
}

export default requireAuth(handler)
