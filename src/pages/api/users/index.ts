import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const users = await prisma.user.findMany({include:{role:true, office:true}})
    res.json(users)
  }
  else if(req.method === 'POST'){
    const user = (req as any).user
    const {email, name, roleId, officeId} = req.body
    const newUser = await prisma.user.create({data:{email, name, password:'temp', roleId, officeId}})
    await prisma.auditLog.create({data:{action:'USER_CREATED', actorId:user.id, details:{userId:newUser.id}}})
    res.json(newUser)
  }
}

export default requireAuth(handler)
