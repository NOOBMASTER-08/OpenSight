'use client';

import { useEffect, useState } from 'react';
import ModuleCard from '../components/ModuleCard';

type Tech = {
  name: string;
  source: string;
};

export default function TechnologyCard({ domain }: { domain: string }) {
  const [tech, setTech] = useState<Tech[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recon/tech?domain=${domain}`)
      .then(res => res.json())
      .then(data => {
        setTech(data.technologies || []);
        setLoading(false);
      });
  }, [domain]);

  return (
    <ModuleCard title="Technology Fingerprint">
      {loading && <p className="text-zinc-400">Fingerprinting...</p>}

      {!loading && tech.length === 0 && (
        <p className="text-yellow-400">
          Limited detection — site may block fingerprinting
        </p>
      )}

      <ul className="space-y-1 text-sm">
        {tech.map((t, i) => (
          <li key={i} className="text-green-400">
            {t.name}{' '}
            <span className="text-zinc-500 text-xs">({t.source})</span>
          </li>
        ))}
      </ul>
    </ModuleCard>
  );
}
