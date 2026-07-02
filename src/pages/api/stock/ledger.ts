import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const ledger = await prisma.stockLedger.findMany({
      include:{item:true},
      orderBy:{createdAt:'desc'}
    })
    res.json(ledger)
  }
  else if(req.method === 'POST'){
    const user = (req as any).user
    const {itemId, type, quantity} = req.body
    
    await prisma.stockLedger.create({data:{itemId, type, quantity}})
    
    const stock = await prisma.stock.findUnique({where:{itemId}})
    if(!stock){
      await prisma.stock.create({data:{itemId, quantity}})
    }else{
      const newQty = type === 'IN' ? stock.quantity + quantity : stock.quantity - quantity
      await prisma.stock.update({where:{itemId}, data:{quantity:Math.max(0, newQty)}})
    }
    
    await prisma.auditLog.create({
      data:{action:'STOCK_' + type, actorId:user.id, details:{itemId, quantity}}
    })
    
    res.json({ok:true})
  }
}

export default requireAuth(handler)
