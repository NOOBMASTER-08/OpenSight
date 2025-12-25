type CloudExposure = {
  provider: 'AWS S3' | 'Azure Blob' | 'Google Cloud Storage';
  url: string;
  public: boolean;
};

const CLOUD_PATTERNS = [
  {
    provider: 'AWS S3' as const,
    regex: /https?:\/\/([a-z0-9.\-]+)\.s3\.amazonaws\.com/gi,
    check: (url: string) => `${url}?list-type=2`
  },
  {
    provider: 'Azure Blob' as const,
    regex: /https?:\/\/([a-z0-9.\-]+)\.blob\.core\.windows\.net/gi,
    check: (url: string) => `${url}?restype=container&comp=list`
  },
  {
    provider: 'Google Cloud Storage' as const,
    regex: /https?:\/\/storage\.googleapis\.com\/([a-z0-9.\-]+)/gi,
    check: (url: string) => url
  }
];

export async function findPublicCloudStorage(
  domain: string
): Promise<CloudExposure[]> {
  const exposures: CloudExposure[] = [];
  const discovered = new Set<string>();

  try {
    const res = await fetch(`https://${domain}`, {
      redirect: 'follow'
    });

    const html = await res.text();

    for (const pattern of CLOUD_PATTERNS) {
      const matches = html.match(pattern.regex);
      matches?.forEach(m => discovered.add(m));
    }

    for (const url of discovered) {
      for (const pattern of CLOUD_PATTERNS) {
        if (!pattern.regex.test(url)) continue;

        try {
          const checkUrl = pattern.check(url);
          const checkRes = await fetch(checkUrl, { method: 'GET' });

          exposures.push({
            provider: pattern.provider,
            url,
            public: checkRes.status === 200
          });
        } catch {
          exposures.push({
            provider: pattern.provider,
            url,
            public: false
          });
        }
      }
    }
  } catch {
    return [];
  }

  return exposures;
}
