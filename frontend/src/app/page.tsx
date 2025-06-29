'use client'
import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const search = async () => {
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) setResults(data.channels); else setError(data.error || 'Failed');
    } catch (e:any) {
      setError('Request failed');
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>YouTube Channel Search</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
      <button onClick={search}>Search</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {results.map((c:any) => (
          <li key={c.id}>
            <strong>{c.title}</strong>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
