import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Users({ user }: any){
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
    fetch('/api/roles').then(r => r.json()).then(setRoles)
  }, [])
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Users — ERP</title></Head>
      <h1>Users</h1>
      
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #ddd'}}>
            <th style={{textAlign:'left', padding:8}}>Email</th>
            <th style={{textAlign:'left', padding:8}}>Name</th>
            <th style={{textAlign:'left', padding:8}}>Role</th>
            <th style={{textAlign:'left', padding:8}}>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:8}}>{u.email}</td>
              <td style={{padding:8}}>{u.name}</td>
              <td style={{padding:8}}>{u.role?.name}</td>
              <td style={{padding:8}}>{u.active ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <p style={{marginTop:24}}><a href="/dashboard">Back to Dashboard</a></p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user) return {redirect:{destination:'/login', permanent:false}}
  return { props: { user } }
}
