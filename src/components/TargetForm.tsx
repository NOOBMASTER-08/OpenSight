'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TargetForm() {
  const [domain, setDomain] = useState('');
  const router = useRouter();

  return (
    <div className="bg-zinc-900 p-6 rounded-lg">
      <input
        className="bg-black border border-zinc-700 p-2 text-sm w-64"
        placeholder="example.com"
        value={domain}
        onChange={e => setDomain(e.target.value)}
      />
      <button
        onClick={() => router.push(`/recon/${domain}`)}
        className="ml-2 px-4 py-2 bg-green-600 text-black font-semibold"
      >
        Scan with OpenSight
      </button>
    </div>
  );
}
