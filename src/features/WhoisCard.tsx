'use client';

import { useEffect, useState } from 'react';
import ModuleCard from '../components/ModuleCard';

export default function WhoisCard({ domain }: { domain: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recon/whois?domain=${domain}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [domain]);

  return (
    <ModuleCard title="WHOIS">
      {loading && <p className="text-zinc-400">Fetching WHOIS…</p>}

      {!loading && data?.error && (
        <p className="text-red-400">WHOIS unavailable</p>
      )}

      {!loading && data && !data.error && (
        <div className="text-sm space-y-1">
          <p><span className="text-zinc-400">Registrar:</span> {data.registrar}</p>
          <p><span className="text-zinc-400">Created:</span> {data.created}</p>
          <p><span className="text-zinc-400">Expires:</span> {data.expires}</p>
          <p><span className="text-zinc-400">Updated:</span> {data.updated}</p>

          <div>
            <p className="text-zinc-400 mt-2">Nameservers:</p>
            {data.nameservers.map((ns: string, i: number) => (
              <p key={i} className="text-green-400">{ns}</p>
            ))}
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
