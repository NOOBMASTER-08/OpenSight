'use client';

import { useEffect, useState } from 'react';
import ModuleCard from '../components/ModuleCard';

const DEFAULT_VISIBLE = 10; // Number of subdomains to show before collapsing

export default function SubdomainCard({ domain }: { domain: string }) {
  const [subs, setSubs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/recon/subdomains?domain=${domain}`)
      .then(res => res.json())
      .then(data => {
        setSubs(Array.isArray(data) ? data : data.subdomains ?? []);
        setLoading(false);
      })
      .catch(() => {
        setSubs([]);
        setLoading(false);
      });
  }, [domain]);

  const displayedSubs = expanded ? subs : subs.slice(0, DEFAULT_VISIBLE);

  return (
    <ModuleCard title="Subdomains">
      {loading && <p className="text-zinc-400">Enumerating...</p>}

      {!loading && subs.length === 0 && (
        <p className="text-red-400">No subdomains found</p>
      )}

      {!loading && subs.length > 0 && (
        <>
          <ul className="space-y-1 text-sm">
            {displayedSubs.map((sub, i) => (
              <li key={i} className="text-green-400 break-all">
                {sub}
              </li>
            ))}
          </ul>

          {subs.length > DEFAULT_VISIBLE && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              {expanded ? 'Show Less' : `Show ${subs.length - DEFAULT_VISIBLE} More`}
            </button>
          )}
        </>
      )}
    </ModuleCard>
  );
}
