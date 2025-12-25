'use client';

import { useEffect, useState } from 'react';
import ModuleCard from '../components/ModuleCard';

/* ---------------- TYPES ---------------- */

type CloudResult = {
  provider: 'AWS S3' | 'Azure Blob' | 'GCP Storage';
  url: string;
};

type CloudStorageCardProps = {
  domain: string;
};

/* ---------------- COMPONENT ---------------- */

export default function CloudStorageCard({ domain }: CloudStorageCardProps) {
  const [results, setResults] = useState<CloudResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/recon/cloud?domain=${domain}`)
      .then(res => res.json())
      .then((data: { exposed?: CloudResult[] }) => {
        setResults(data.exposed ?? []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [domain]);

  return (
    <ModuleCard title="Cloud Storage Exposure">
      {loading && (
        <p className="text-zinc-400 text-sm">
          Searching for public cloud storage…
        </p>
      )}

      {!loading && results.length === 0 && (
        <p className="text-zinc-500 text-sm">
          No publicly accessible cloud storage found
        </p>
      )}

      <ul className="space-y-2 text-sm break-all">
        {results.map((item, i) => (
          <li
            key={i}
            className="border border-red-800 bg-red-950/40 p-2 rounded"
          >
            <p className="text-red-400 font-medium">
              {item.provider}
            </p>
            <p className="text-green-400">{item.url}</p>
            <p className="text-xs text-red-300">
              Publicly Accessible
            </p>
          </li>
        ))}
      </ul>
    </ModuleCard>
  );
}
