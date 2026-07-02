import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { getUserFromReq } from '@/lib/auth'

export default function Approvals({ user }: any){
  const [approvals, setApprovals] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any>({})
  
  useEffect(() => {
    fetch('/api/approvals/pending').then(r => r.json()).then(setApprovals)
  }, [])
  
  const decide = async (approvalId:string, decision:string) => {
    const comment = (decisions[approvalId] || {}).comment || ''
    await fetch(`/api/approvals/${approvalId}`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({decision, comment})
    })
    fetch('/api/approvals/pending').then(r => r.json()).then(setApprovals)
  }
  
  return (
    <div style={{padding:24, fontFamily:'Inter, sans-serif'}}>
      <Head><title>Approvals — ERP</title></Head>
      <h1>Pending Approvals</h1>
      
      {approvals.length === 0 && <p>No pending approvals</p>}
      
      {approvals.map(approval => (
        <div key={approval.id} style={{border:'1px solid #ddd', padding:16, borderRadius:8, marginBottom:12}}>
          <h4>Demand {approval.demand.id.slice(0, 8)}</h4>
          <p>Requester: {approval.demand.requester?.name}</p>
          <p>Items: {approval.demand.lines.map(l => `${l.item.name} x${l.qty}`).join(', ')}</p>
          <div style={{marginTop:8}}>
            <input
              type="text"
              placeholder="Comment (optional)"
              value={(decisions[approval.id] || {}).comment || ''}
              onChange={(e) => setDecisions({...decisions, [approval.id]:{comment:e.target.value}})}
              style={{width:'100%', padding:8, marginBottom:8}}
            />
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={() => decide(approval.id, 'approved')} style={{background:'green', color:'white', padding:'8px 16px'}}>Approve</button>
            <button onClick={() => decide(approval.id, 'rejected')} style={{background:'red', color:'white', padding:'8px 16px'}}>Reject</button>
          </div>
        </div>
      ))}
      
      <p><a href="/dashboard">Back to Dashboard</a></p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user) return {redirect:{destination:'/login', permanent:false}}
  return { props: { user } }
}
