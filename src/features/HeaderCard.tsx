'use client';

import { useEffect, useState } from 'react';
import ModuleCard from '../components/ModuleCard';

interface SecurityInfo {
  present: string[];
  missing: string[];
  warnings: string[];
  score: number;
}

interface HeaderReconResponse {
  headers: Record<string, string>;
  security: SecurityInfo;
}

export default function HeaderCard({ domain }: { domain: string }) {
  const [data, setData] = useState<HeaderReconResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/recon/headers?domain=${domain}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [domain]);

  if (loading) {
    return (
      <ModuleCard title="Security Headers">
        <p className="text-zinc-400">Fetching headers...</p>
      </ModuleCard>
    );
  }

  if (!data) {
    return (
      <ModuleCard title="Security Headers">
        <p className="text-red-400">Failed to fetch headers.</p>
      </ModuleCard>
    );
  }

  const { security } = data;
  const { present, missing, warnings, score } = security;

  const scoreColor =
    score >= 80 ? 'bg-green-500' :
    score >= 60 ? 'bg-yellow-500' :
    score >= 40 ? 'bg-orange-500' :
    'bg-red-500';

  const renderBadge = (label: string, color: string) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color} mr-2 mb-2`}>{label}</span>
  );

  return (
    <ModuleCard title="Security Headers">
      {/* Score */}
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm font-medium">
          <span>Security Score</span>
          <span>{score}/100</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div className={`${scoreColor} h-3 rounded-full`} style={{ width: `${score}%` }}></div>
        </div>
      </div>

      {/* Present Headers */}
      <div className="mb-4">
        <h3 className="font-semibold text-green-700 mb-2">Present</h3>
        <div className="flex flex-wrap">
          {present.length ? present.map(h => renderBadge(h, 'bg-green-100 text-green-800')) : <span className="text-zinc-400">None</span>}
        </div>
      </div>

      {/* Missing Headers */}
      <div className="mb-4">
        <h3 className="font-semibold text-red-600 mb-2">Missing</h3>
        <div className="flex flex-wrap">
          {missing.length ? missing.map(h => renderBadge(h, 'bg-red-100 text-red-800')) : <span className="text-zinc-400">None</span>}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h3 className="font-semibold text-orange-600 mb-2">Warnings</h3>
          <div className="flex flex-wrap">
            {warnings.map((w, i) => renderBadge(w, 'bg-orange-100 text-orange-800'))}
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
