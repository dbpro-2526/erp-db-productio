import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Dashboard({ user }: any){
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/reports/dashboard').then(r => r.json()).then(setStats)
  }, [])
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Dashboard — ERP</title></Head>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role?.name} | Office: {user?.office?.name}</p>
      
      {stats && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginTop:24}}>
          <div style={{border:'1px solid #ddd', padding:16, borderRadius:8}}>
            <h3>Total Demands</h3>
            <p style={{fontSize:24}}>{stats.totalDemands}</p>
          </div>
          <div style={{border:'1px solid #ddd', padding:16, borderRadius:8}}>
            <h3>Pending</h3>
            <p style={{fontSize:24}}>{stats.pendingDemands}</p>
          </div>
          <div style={{border:'1px solid #ddd', padding:16, borderRadius:8}}>
            <h3>Total Items</h3>
            <p style={{fontSize:24}}>{stats.totalItems}</p>
          </div>
          <div style={{border:'1px solid #ddd', padding:16, borderRadius:8}}>
            <h3>Total Users</h3>
            <p style={{fontSize:24}}>{stats.totalUsers}</p>
          </div>
        </div>
      )}
      
      <div style={{marginTop:32}}>
        <h2>Navigation</h2>
        <ul>
          <li><a href="/demands">Manage Demands</a></li>
          <li><a href="/approvals">Pending Approvals</a></li>
          <li><a href="/stock">Stock Management</a></li>
          <li><a href="/items">Items</a></li>
          <li><a href="/users">Users</a></li>
          <li><a href="/admin">Admin Panel</a></li>
          <li><a href="/api/auth/logout">Sign out</a></li>
        </ul>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user){
    return {redirect:{destination:'/login', permanent:false}}
  }
  if((user as any).password) delete (user as any).password
  return { props: { user } }
}
