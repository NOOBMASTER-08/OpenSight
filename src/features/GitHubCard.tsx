'use client';

import { useEffect, useState } from 'react';

type Repo = {
  name: string;
  full_name: string;
  url: string;
  confidence: number;
  signals: string[];
};

export default function GitHubCard({ domain }: { domain: string }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recon/github?domain=${domain}`)
      .then(async res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data?.repos && Array.isArray(data.repos)) {
          setRepos(data.repos);
        } else {
          setRepos([]);
        }
      })
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, [domain]);

  if (loading) {
    return (
      <div className="bg-black p-4 rounded-lg border border-zinc-800 text-gray-400">
        Fetching GitHub repositories...
      </div>
    );
  }

  return (
    <div className="bg-black p-4 rounded-lg border border-zinc-800">
      <h2 className="text-white font-semibold mb-3">
        GitHub Repositories
      </h2>

      {repos.length ? (
        <div className="space-y-3">
          {repos.map((repo, i) => (
            <div key={i} className="border border-zinc-700 rounded p-3">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 font-medium hover:underline"
              >
                {repo.full_name}
              </a>

              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                <span>Confidence: {repo.confidence}%</span>
                <span>{repo.signals.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No repositories found</p>
      )}
    </div>
  );
}
