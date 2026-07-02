import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const offices = await prisma.office.findMany({include:{children:true, parent:true}})
    res.json(offices)
  }
  else if(req.method === 'POST'){
    const {name, type, parentId} = req.body
    const office = await prisma.office.create({data:{name, type, parentId}})
    res.json(office)
  }
}

export default requireAuth(handler)
