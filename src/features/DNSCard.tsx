'use client';

import { useEffect, useState } from 'react';

type DNSAnswer = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

type DNSResponse = {
  IP: DNSAnswer[];
};

export default function DNSCard({ domain }: { domain: string }) {
  const [data, setData] = useState<DNSResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  console.log('Domain received:', domain);

  fetch(`/api/recon/dns?domain=${encodeURIComponent(domain)}`)
    .then(res => res.json())
    .then(res => {
      console.log('API response:', res);
      setData(res);
    })
    .catch(err => {
      console.error('Fetch error:', err);
      setData(null);
    })
    .finally(() => setLoading(false));
  }, [domain]);

  if (loading) {
    return (
      <div className="bg-black p-4 rounded-lg border border-zinc-800 text-gray-400">
        Resolving IPs...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-black p-4 rounded-lg border border-red-800 text-red-400">
        Failed to load DNS data
      </div>
    );
  }

  return (
    <div className="bg-black p-4 rounded-lg border border-zinc-800">
      <h2 className="text-white font-semibold mb-2">DNS Resolution</h2>

      {data.IP.length ? (
        data.IP.map((record, i) => (
          <div key={i} className="text-green-400 space-y-1">
            <p>
              <span className="text-gray-400">Domain:</span>{' '}
              {record.name.replace(/\.$/, '')}
            </p>
            <p>
              <span className="text-gray-400">IP Address:</span>{' '}
              {record.data}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">None</p>
      )}
    </div>
  );
}
