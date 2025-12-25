import DNSCard from '../../../features/DNSCard';
import SubdomainCard from '../../../features/SubdomainCard';
import GitHubCard from '../../../features/GitHubCard';
import TechnologyCard from '../../../features/TechnologyCard';
import HeaderCard from '../../../features/HeaderCard';
import TLSCard from '../../../features/TLSCard';
import CloudStorageCard from '../../../features/CloudStorageCard';
import WhoisCard from '../../../features/WhoisCard';

export default async function ReconPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: rawDomain } = await params;

  const domain = decodeURIComponent(rawDomain)
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <DNSCard domain={domain} />
      <SubdomainCard domain={domain} />
      <GitHubCard domain={domain} />
      <WhoisCard domain={domain} />
      <TechnologyCard domain={domain} />
      <HeaderCard domain={domain} />
      <TLSCard domain={domain} />
      <CloudStorageCard domain={domain} />
    </div>
  );
}




