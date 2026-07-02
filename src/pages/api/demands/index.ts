import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const demands = await prisma.demand.findMany({
      include:{lines:{include:{item:true}}, approvals:{include:{approver:true}}, requester:true},
      orderBy:{createdAt:'desc'}
    })
    res.json(demands)
  }
  else if(req.method === 'POST'){
    const user = (req as any).user
    const {lines} = req.body
    const demand = await prisma.demand.create({
      data:{
        requesterId:user.id,
        lines:{create:lines}
      },
      include:{lines:{include:{item:true}}}
    })
    await prisma.auditLog.create({
      data:{action:'DEMAND_CREATED', actorId:user.id, details:{demandId:demand.id}}
    })
    res.json(demand)
  }
}

export default requireAuth(handler)
