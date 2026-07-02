import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { sendEmail } from '@/services/email'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const user = (req as any).user
  const {decision, comment} = req.body
  
  const approval = await prisma.approval.findUnique({where:{id:id as string}, include:{demand:{include:{requester:true}}}})
  if(!approval) return res.status(404).json({message:'Not found'})
  
  const updated = await prisma.approval.update({
    where:{id:id as string},
    data:{decision, comment, decidedAt:new Date()},
    include:{demand:true}
  })
  
  await prisma.auditLog.create({
    data:{action:'APPROVAL_DECISION', actorId:user.id, details:{approvalId:updated.id, decision}}
  })
  
  // Email to requester
  await sendEmail(
    approval.demand.requester.email,
    `Demand ${approval.demand.id} - ${decision}`,
    `Your demand has been ${decision}. Comment: ${comment || 'None'}`
  )
  
  res.json(updated)
}

export default requireAuth(handler)
