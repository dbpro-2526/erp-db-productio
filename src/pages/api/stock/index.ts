import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'GET'){
    const stocks = await prisma.stock.findMany({
      include:{item:true},
      orderBy:{item:{sku:'asc'}}
    })
    res.json(stocks)
  }
}

export default requireAuth(handler)
