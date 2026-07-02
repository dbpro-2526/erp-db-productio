import Head from 'next/head'

export default function Home(){
  return (
    <div style={{fontFamily:'Inter, sans-serif',padding:24}}>
      <Head>
        <title>ERP Inventory System</title>
      </Head>
      <h1>ERP Inventory System</h1>
      <p>Complete demand & inventory management system.</p>
      <p><a href="/login">Go to Login</a></p>
    </div>
  )
}
