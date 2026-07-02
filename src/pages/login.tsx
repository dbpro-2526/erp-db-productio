import Head from 'next/head'
import { useState } from 'react'

export default function Login(){
  const [email, setEmail] = useState('dbprodhind@gmail.com')
  const [password, setPassword] = useState('dbpr@2526')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e:any){
    e.preventDefault();
    setLoading(true); setError('')
    try{
      const res = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})})
      const data = await res.json()
      if(!res.ok) throw new Error(data?.message || 'Login failed')
      window.location.href = '/dashboard'
    }catch(err:any){
      setError(err.message)
    }finally{setLoading(false)}
  }

  return (
    <div style={{maxWidth:480,margin:'64px auto',padding:20,fontFamily:'Inter, sans-serif'}}>
      <Head><title>Login — ERP</title></Head>
      <div style={{textAlign:'center', marginBottom:32}}>
        <h1>ERP System</h1>
        <p>Inventory & Demand Management</p>
      </div>
      <form onSubmit={submit} style={{display:'grid',gap:12, border:'1px solid #ddd', padding:24, borderRadius:8}}>
        <label>
          <div style={{marginBottom:4, fontWeight:'500'}}>Email</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={{width:'100%',padding:12, border:'1px solid #ddd', borderRadius:4}} />
        </label>
        <label>
          <div style={{marginBottom:4, fontWeight:'500'}}>Password</div>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required style={{width:'100%',padding:12, border:'1px solid #ddd', borderRadius:4}} />
        </label>
        <button type="submit" disabled={loading} style={{padding:'12px 16px', background:'#007bff', color:'white', border:'none', borderRadius:4, cursor:'pointer', fontWeight:'500'}}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <div style={{color:'red', padding:12, background:'#ffe6e6', borderRadius:4}}>{error}</div>}
      </form>
      <div style={{textAlign:'center', marginTop:24, fontSize:14, color:'#666'}}>
        <p>Demo Credentials:</p>
        <p>Email: dbprodhind@gmail.com</p>
        <p>Password: dbpr@2526</p>
      </div>
    </div>
  )
}
