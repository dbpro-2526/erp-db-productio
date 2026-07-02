import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const items = await prisma.item.findMany()
    res.json(items)
  }
  else if(req.method === 'POST'){
    const user = (req as any).user
    const {sku, name, unit, cost, price} = req.body
    const item = await prisma.item.create({data:{sku, name, unit, cost, price}})
    await prisma.auditLog.create({data:{action:'ITEM_CREATED', actorId:user.id, details:{itemId:item.id}}})
    res.json(item)
  }
}

export default requireAuth(handler)
