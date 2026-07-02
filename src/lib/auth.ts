import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import prisma from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'replace_me_with_secure_random'

export async function getUserFromReq(req:any){
  try{
    const cookie = req.headers?.cookie
    if(!cookie) return null
    const parsed = parse(cookie)
    const token = parsed.erp_token
    if(!token) return null
    const decoded:any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    if(!userId) return null
    const user = await prisma.user.findUnique({where:{id:userId}, include:{role:true, office:true}})
    return user
  }catch(e){
    return null
  }
}

export function requireAuth(handler:any){
  return async (req:any, res:any) => {
    const user = await getUserFromReq(req)
    if(!user) return res.status(401).json({message:'Unauthorized'})
    req.user = user
    return handler(req, res)
  }
}

export function requireRole(roles:string[], handler:any){
  return requireAuth(async (req:any, res:any) => {
    if(!roles.includes(req.user.role.name)) return res.status(403).json({message:'Forbidden'})
    return handler(req, res)
  })
}
