import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Demands({ user }: any){
  const [demands, setDemands] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [lines, setLines] = useState<any[]>([{itemId:'', qty:0}])
  const [items, setItems] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/demands').then(r => r.json()).then(setDemands)
    fetch('/api/items').then(r => r.json()).then(setItems)
  }, [])
  
  const submit = async () => {
    await fetch('/api/demands', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({lines})})
    setShowForm(false)
    setLines([{itemId:'', qty:0}])
    fetch('/api/demands').then(r => r.json()).then(setDemands)
  }
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Demands — ERP</title></Head>
      <h1>Demands</h1>
      <button onClick={() => setShowForm(!showForm)}>+ New Demand</button>
      
      {showForm && (
        <div style={{border:'1px solid #ddd', padding:16, borderRadius:8, marginTop:16}}>
          <h3>Create Demand</h3>
          {lines.map((line, i) => (
            <div key={i} style={{display:'flex', gap:8, marginBottom:8}}>
              <select value={line.itemId} onChange={(e) => {lines[i].itemId = e.target.value; setLines([...lines])}}
                style={{flex:1}}>
                <option value="">Select Item</option>
                {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <input type="number" value={line.qty} onChange={(e) => {lines[i].qty = Number(e.target.value); setLines([...lines])}}
                placeholder="Qty" style={{width:80}} />
              <button onClick={() => setLines(lines.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
          <button onClick={() => setLines([...lines, {itemId:'', qty:0}])}>+ Add Line</button>
          <div style={{marginTop:8}}>
            <button onClick={submit} style={{marginRight:8}}>Submit</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      <div style={{marginTop:24}}>
        {demands.map(demand => (
          <div key={demand.id} style={{border:'1px solid #ddd', padding:16, borderRadius:8, marginBottom:12}}>
            <h4>Demand {demand.id.slice(0, 8)}</h4>
            <p>Status: <strong>{demand.status}</strong></p>
            <p>Requester: {demand.requester?.name}</p>
            <p>Lines: {demand.lines.length}</p>
            <a href={`/demands/${demand.id}`}>View Details</a>
          </div>
        ))}
      </div>
      
      <p><a href="/dashboard">Back to Dashboard</a></p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user) return {redirect:{destination:'/login', permanent:false}}
  return { props: { user } }
}
