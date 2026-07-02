import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Stock({ user }: any){
  const [stocks, setStocks] = useState<any[]>([])
  const [ledger, setLedger] = useState<any[]>([])
  const [itemId, setItemId] = useState('')
  const [type, setType] = useState('IN')
  const [qty, setQty] = useState(0)
  const [items, setItems] = useState<any[]>([])
  
  useEffect(() => {
    fetch('/api/stock').then(r => r.json()).then(setStocks)
    fetch('/api/stock/ledger').then(r => r.json()).then(setLedger)
    fetch('/api/items').then(r => r.json()).then(setItems)
  }, [])
  
  const submit = async () => {
    await fetch('/api/stock/ledger', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({itemId, type, quantity:qty})
    })
    setItemId('')
    setQty(0)
    fetch('/api/stock').then(r => r.json()).then(setStocks)
    fetch('/api/stock/ledger').then(r => r.json()).then(setLedger)
  }
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Stock — ERP</title></Head>
      <h1>Stock Management</h1>
      
      <div style={{border:'1px solid #ddd', padding:16, borderRadius:8, marginBottom:24}}>
        <h3>Stock In/Out</h3>
        <div style={{display:'grid', gap:12}}>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
            <option value="">Select Item</option>
            {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
          </select>
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Quantity" />
          <button onClick={submit} style={{padding:'8px 16px'}}>Submit</button>
        </div>
      </div>
      
      <div>
        <h3>Current Stock</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #ddd'}}>
              <th style={{textAlign:'left', padding:8}}>SKU</th>
              <th style={{textAlign:'left', padding:8}}>Item</th>
              <th style={{textAlign:'left', padding:8}}>Quantity</th>
              <th style={{textAlign:'left', padding:8}}>Reserved</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id} style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:8}}>{stock.item?.sku}</td>
                <td style={{padding:8}}>{stock.item?.name}</td>
                <td style={{padding:8}}>{stock.quantity}</td>
                <td style={{padding:8}}>{stock.reserved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{marginTop:24}}>
        <h3>Recent Ledger</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #ddd'}}>
              <th style={{textAlign:'left', padding:8}}>Item</th>
              <th style={{textAlign:'left', padding:8}}>Type</th>
              <th style={{textAlign:'left', padding:8}}>Qty</th>
              <th style={{textAlign:'left', padding:8}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {ledger.slice(0, 20).map(entry => (
              <tr key={entry.id} style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:8}}>{entry.item?.name}</td>
                <td style={{padding:8}}>{entry.type}</td>
                <td style={{padding:8}}>{entry.quantity}</td>
                <td style={{padding:8}}>{new Date(entry.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p style={{marginTop:24}}><a href="/dashboard">Back to Dashboard</a></p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user) return {redirect:{destination:'/login', permanent:false}}
  return { props: { user } }
}
