# OpenSight
OpenSight is a lightweight reconnaissance toolkit implemented as a Next.js application. It provides a small web UI and API routes for common domain footprinting and discovery tasks.

<a href="https://open-sight-six.vercel.app/" target="_blank"><img width="557" height="352" alt="image" src="https://github.com/user-attachments/assets/5799a471-ae2e-4e7c-a7cd-4bc4c6d5972a" /></a>

## Features
- Domain → IP lookups
- Subdomain discovery
- GitHub repository discovery for targets
- WHOIS queries
- Technology fingerprinting
- Cloud storage exposure checks (S3/GCS/Azure Blob heuristics)
- TLS / certificate inspection
- Security header checks
## Quick Start
1. Install dependencies:
```bash
npm install
```
2. Run the development server:
```bash
npm run dev
```
3. Open the app in your browser at http://localhost:3000
## Project Structure
- `app/` — Next.js app routes, pages, and `app/api/recon/*` API endpoints.
- `src/lib/` — core recon helpers: `dns.ts`, `whois.ts`, `github.ts`, `tls.ts`, `headers.ts`, `subdomain.ts`, `cloudStorageFinder.ts`, `techFingerprint.ts`.
- `src/components/` & `src/features/` — UI components and feature cards used on the frontend.

## Environment variables

Add runtime secrets to `.env.local` at the project root. Typical variables you may want to configure:

- `CHAOS API` — Subdomain discovery.
- `BUILTWITH_API_KEY` — Technology stack information.

Do not commit `.env.local` to source control.

