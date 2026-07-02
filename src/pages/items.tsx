import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Items({ user }: any){
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({sku:'', name:'', unit:'', cost:0, price:0})
  
  useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(setItems)
  }, [])
  
  const submit = async () => {
    await fetch('/api/items', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(form)
    })
    setShowForm(false)
    setForm({sku:'', name:'', unit:'', cost:0, price:0})
    fetch('/api/items').then(r => r.json()).then(setItems)
  }
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Items — ERP</title></Head>
      <h1>Items</h1>
      <button onClick={() => setShowForm(!showForm)}>+ New Item</button>
      
      {showForm && (
        <div style={{border:'1px solid #ddd', padding:16, borderRadius:8, marginTop:16}}>
          <h3>Create Item</h3>
          <div style={{display:'grid', gap:12}}>
            <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({...form, sku:e.target.value})} />
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} />
            <input placeholder="Unit" value={form.unit} onChange={(e) => setForm({...form, unit:e.target.value})} />
            <input type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm({...form, cost:Number(e.target.value)})} />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price:Number(e.target.value)})} />
            <button onClick={submit}>Submit</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      <table style={{width:'100%', marginTop:16, borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #ddd'}}>
            <th style={{textAlign:'left', padding:8}}>SKU</th>
            <th style={{textAlign:'left', padding:8}}>Name</th>
            <th style={{textAlign:'left', padding:8}}>Unit</th>
            <th style={{textAlign:'left', padding:8}}>Cost</th>
            <th style={{textAlign:'left', padding:8}}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:8}}>{item.sku}</td>
              <td style={{padding:8}}>{item.name}</td>
              <td style={{padding:8}}>{item.unit}</td>
              <td style={{padding:8}}>₹{item.cost}</td>
              <td style={{padding:8}}>₹{item.price}</td>
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
