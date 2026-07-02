import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const user = (req as any).user
    const approvals = await prisma.approval.findMany({
      where:{approverId:user.id},
      include:{demand:{include:{lines:{include:{item:true}}, requester:true}}, approver:true},
      orderBy:{createdAt:'desc'}
    })
    res.json(approvals)
  }
}

export default requireAuth(handler)
