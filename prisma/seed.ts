import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(){
  // Create roles
  const roles = [
    {name:'Super Admin', permissions:['*']},
    {name:'Admin', permissions:['users:read','users:write','items:*','stock:*','reports:*']},
    {name:'State Manager', permissions:['demands:*','approvals:*','reports:read']},
    {name:'State Office', permissions:['demands:read','stock:read']},
    {name:'Region Manager', permissions:['demands:approve','stock:*']},
    {name:'Division Manager', permissions:['demands:approve','stock:read']},
    {name:'Warehouse Manager', permissions:['stock:*','items:read']},
    {name:'Production Manager', permissions:['demands:create','stock:read']},
    {name:'Accountant', permissions:['reports:*','stock:read']},
    {name:'Regular User', permissions:['demands:create','stock:read']}
  ]
  
  for(const r of roles){
    await prisma.role.upsert({
      where:{name:r.name},
      update:{permissions:r.permissions},
      create:{name:r.name, permissions:r.permissions}
    })
  }
  console.log('Roles seeded')

  // Create offices
  const stateOffice = await prisma.office.upsert({
    where:{name:'State Office'},
    update:{},
    create:{name:'State Office', type:'STATE'}
  })
  
  const region1 = await prisma.office.upsert({
    where:{name:'Region 1'},
    update:{},
    create:{name:'Region 1', type:'REGION', parentId:stateOffice.id}
  })
  
  const div1 = await prisma.office.upsert({
    where:{name:'Division 1'},
    update:{},
    create:{name:'Division 1', type:'DIVISION', parentId:region1.id}
  })
  console.log('Offices seeded')

  // Create admin user
  const adminEmail = 'dbprodhind@gmail.com'
  const existing = await prisma.user.findUnique({where:{email:adminEmail}})
  if(!existing){
    const role = await prisma.role.findUnique({where:{name:'Super Admin'}})
    const hashed = await bcrypt.hash('dbpr@2526', 10)
    await prisma.user.create({
      data:{
        email:adminEmail,
        password:hashed,
        name:'Super Admin',
        roleId:role!.id,
        officeId:stateOffice.id
      }
    })
    console.log('Seeded Super Admin:', adminEmail)
  }

  // Create sample users
  const users = [
    {email:'manager@example.com', name:'Region Manager', role:'Region Manager'},
    {email:'warehouse@example.com', name:'Warehouse Manager', role:'Warehouse Manager'},
    {email:'user@example.com', name:'Regular User', role:'Regular User'}
  ]
  
  for(const u of users){
    const existing = await prisma.user.findUnique({where:{email:u.email}})
    if(!existing){
      const role = await prisma.role.findUnique({where:{name:u.role}})
      const hashed = await bcrypt.hash('Password@123', 10)
      await prisma.user.create({
        data:{
          email:u.email,
          password:hashed,
          name:u.name,
          roleId:role!.id,
          officeId:div1.id
        }
      })
    }
  }
  console.log('Sample users seeded')

  // Create sample items
  const items = [
    {sku:'ITEM001', name:'Fertilizer Type A', unit:'kg', cost:50, price:75},
    {sku:'ITEM002', name:'Fertilizer Type B', unit:'kg', cost:60, price:90},
    {sku:'ITEM003', name:'Seeds Pack', unit:'pack', cost:100, price:150},
    {sku:'ITEM004', name:'Pesticide', unit:'liter', cost:500, price:750}
  ]
  
  for(const item of items){
    const existing = await prisma.item.findUnique({where:{sku:item.sku}})
    if(!existing){
      await prisma.item.create({data:item})
    }
  }
  console.log('Sample items seeded')
}

main()
  .catch(e=>{console.error(e);process.exit(1)})
  .finally(()=>prisma.$disconnect())
