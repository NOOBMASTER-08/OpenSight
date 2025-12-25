const GITHUB_API = 'https://api.github.com';

export type RepoResult = {
  name: string;
  full_name: string;
  url: string;
  confidence: number;
  signals: string[];
};

// ─────────────────────────────
// Helpers
// ─────────────────────────────
function domainBase(domain: string) {
  return domain.split('.')[0].toLowerCase();
}

// ─────────────────────────────
// Check if org is verified
// ─────────────────────────────
async function isVerifiedOrg(org: string): Promise<boolean> {
  const res = await fetch(`${GITHUB_API}/orgs/${org}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.is_verified === true;
}

// ─────────────────────────────
// Confidence calculator
// ─────────────────────────────
function calculateConfidence(signals: string[]): number {
  let score = 10; // base confidence

  if (signals.includes('verified_org')) score += 40;
  if (signals.includes('org_name_match')) score += 30;
  if (signals.includes('popular_repo')) score += 20;

  return Math.min(score, 100);
}

// ─────────────────────────────
// MAIN FUNCTION (IMPROVED)
// ─────────────────────────────
export async function githubRecon(domain: string) {
  const base = domainBase(domain);
  const results: RepoResult[] = [];

  const searchRes = await fetch(
    `${GITHUB_API}/search/repositories?q=${base}&sort=stars&order=desc`
  );

  const searchData = await searchRes.json();
  const repos = searchData.items?.slice(0, 20) || [];

  for (const repo of repos) {
    const signals: string[] = [];

    // HARD FILTERS
    if (repo.fork || repo.archived) continue;
    if (repo.owner.type !== 'Organization') continue;

    const org = repo.owner.login.toLowerCase();

    // Org name similarity
    if (org.includes(base) || base.includes(org)) {
      signals.push('org_name_match');
    }

    // Verified org
    if (await isVerifiedOrg(org)) {
      signals.push('verified_org');
    }

    // Repo quality
    if (repo.stargazers_count > 10) {
      signals.push('popular_repo');
    }

    // Final decision
    if (signals.length > 0) {
      results.push({
        name: repo.name,
        full_name: repo.full_name,
        url: repo.html_url,
        confidence: calculateConfidence(signals),
        signals,
      });
    }
  }

  return {
    domain,
    total: results.length,
    repos: results.sort((a, b) => b.confidence - a.confidence),
  };
}
