'use client';

import { useEffect, useState } from 'react';
import ModuleCard from '../components/ModuleCard';

interface Cert {
  subject?: any;
  issuer?: any;
  valid_from?: string;
  valid_to?: string;
}

export default function TLSCard({ domain }: { domain: string }) {
  const [cert, setCert] = useState<Cert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recon/tls?domain=${domain}`)
      .then(res => res.json())
      .then(data => {
        setCert(data);
        setLoading(false);
      });
  }, [domain]);

  return (
    <ModuleCard title="TLS Certificate">
      {loading && <p className="text-zinc-400">Inspecting TLS...</p>}

      {cert && (
        <div className="text-sm space-y-1">
          <p>
            <span className="text-zinc-400">Issuer:</span>{' '}
            <span className="text-green-400">
              {cert.issuer?.O || 'Unknown'}
            </span>
          </p>

          <p>
            <span className="text-zinc-400">Valid From:</span>{' '}
            {cert.valid_from}
          </p>

          <p>
            <span className="text-zinc-400">Valid To:</span>{' '}
            {cert.valid_to}
          </p>
        </div>
      )}
    </ModuleCard>
  );
}
