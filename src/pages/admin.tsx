import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Admin({ user }: any){
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [offices, setOffices] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
    fetch('/api/roles').then(r => r.json()).then(setRoles)
    fetch('/api/offices').then(r => r.json()).then(setOffices)
    fetch('/api/items').then(r => r.json()).then(setItems)
  }, [])
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Admin — ERP</title></Head>
      <h1>Admin Panel</h1>
      
      <div style={{display:'flex', gap:12, marginBottom:24, borderBottom:'1px solid #ddd', paddingBottom:12}}>
        <button onClick={() => setTab('users')} style={{fontWeight:tab==='users'?'bold':'normal'}}>Users</button>
        <button onClick={() => setTab('roles')} style={{fontWeight:tab==='roles'?'bold':'normal'}}>Roles</button>
        <button onClick={() => setTab('offices')} style={{fontWeight:tab==='offices'?'bold':'normal'}}>Offices</button>
        <button onClick={() => setTab('items')} style={{fontWeight:tab==='items'?'bold':'normal'}}>Items</button>
      </div>
      
      {tab === 'users' && (
        <div>
          <h2>Users ({users.length})</h2>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{textAlign:'left', padding:8}}>Email</th>
                <th style={{textAlign:'left', padding:8}}>Name</th>
                <th style={{textAlign:'left', padding:8}}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:8}}>{u.email}</td>
                  <td style={{padding:8}}>{u.name}</td>
                  <td style={{padding:8}}>{u.role?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {tab === 'roles' && (
        <div>
          <h2>Roles ({roles.length})</h2>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{textAlign:'left', padding:8}}>Name</th>
                <th style={{textAlign:'left', padding:8}}>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:8}}>{r.name}</td>
                  <td style={{padding:8}}>{r.permissions.join(', ') || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {tab === 'offices' && (
        <div>
          <h2>Offices ({offices.length})</h2>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{textAlign:'left', padding:8}}>Name</th>
                <th style={{textAlign:'left', padding:8}}>Type</th>
                <th style={{textAlign:'left', padding:8}}>Parent</th>
              </tr>
            </thead>
            <tbody>
              {offices.map(o => (
                <tr key={o.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:8}}>{o.name}</td>
                  <td style={{padding:8}}>{o.type}</td>
                  <td style={{padding:8}}>{o.parent?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {tab === 'items' && (
        <div>
          <h2>Items ({items.length})</h2>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #ddd'}}>
                <th style={{textAlign:'left', padding:8}}>SKU</th>
                <th style={{textAlign:'left', padding:8}}>Name</th>
                <th style={{textAlign:'left', padding:8}}>Cost</th>
                <th style={{textAlign:'left', padding:8}}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:8}}>{i.sku}</td>
                  <td style={{padding:8}}>{i.name}</td>
                  <td style={{padding:8}}>₹{i.cost}</td>
                  <td style={{padding:8}}>₹{i.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <p style={{marginTop:24}}><a href="/dashboard">Back to Dashboard</a></p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user) return {redirect:{destination:'/login', permanent:false}}
  return { props: { user } }
}
