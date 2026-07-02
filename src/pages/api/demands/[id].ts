import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const user = (req as any).user
  
  if(req.method === 'GET'){
    const demand = await prisma.demand.findUnique({
      where:{id:id as string},
      include:{lines:{include:{item:true}}, approvals:{include:{approver:true}}, requester:true}
    })
    if(!demand) return res.status(404).json({message:'Not found'})
    res.json(demand)
  }
  else if(req.method === 'PATCH'){
    const {status} = req.body
    const demand = await prisma.demand.update({
      where:{id:id as string},
      data:{status},
      include:{lines:{include:{item:true}}, approvals:{include:{approver:true}}}
    })
    await prisma.auditLog.create({
      data:{action:'DEMAND_UPDATED', actorId:user.id, details:{demandId:demand.id, status}}
    })
    res.json(demand)
  }
}

export default requireAuth(handler)
