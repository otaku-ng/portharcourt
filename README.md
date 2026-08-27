# PH Otakus

PH Otakus is the web platform for the Port Harcourt otaku community. It brings together anime, manga, gaming, cosplay, community events and stories from the people building the local culture.

## Features

- Community homepage and editorial pages
- Published events, event details and event RSVP
- Gallery albums and image archive
- Stories/blog content managed with Markdown
- Newsletter signup records and admin management
- Google member sign-in with Auth.js
- Member profiles, public member directory, search and filters
- Profile avatars and banners stored in Cloudflare R2
- Otaku Passport badges and event activity
- Profile privacy controls and self-service account deletion
- Admin CMS for events, gallery and stories
- Database-backed admin roles, including `SUPER_ADMIN`

## Stack

- Next.js `16.3.1` App Router
- React `19.2.8`
- TypeScript
- Tailwind CSS `4`
- Prisma `7.9.1` with PostgreSQL
- Auth.js / NextAuth `5.0.0-beta.32` with database sessions
- Google OAuth
- Cloudflare R2 through the S3-compatible AWS SDK

## Project structure

```text
app/         Routes, layouts, metadata routes and API handlers
components/  Shared server and client UI components
lib/         Repositories, server actions, validation and integrations
prisma/      Prisma schema, migrations and seed data
public/      Fonts, logos and static visual assets
```

Database access follows a repository/service/action pattern. Repository modules own Prisma reads and writes, server actions handle authenticated mutations, and Zod schemas validate form input on the server.

## Local setup

Create a PostgreSQL database, then run:

```bash
yarn
cp .env.example .env
yarn db:generate
yarn db:migrate
yarn db:seed
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). `yarn db:migrate` creates or applies the local migration history. Use `yarn db:migrate:deploy` in a deployed environment.

## Environment variables

Copy `.env.example` to `.env` and supply local values. Never commit secrets.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `AUTH_SECRET` | Auth.js session and encryption secret. |
| `AUTH_GOOGLE_ID` | Google OAuth client ID. |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret. |
| `SITE_URL` | Canonical public site origin for metadata, `robots.txt` and `sitemap.xml`; set the deployed HTTPS origin without a trailing slash. |
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | Optional public WhatsApp group invite used by the community join link. |
| `R2_ACCOUNT_ID` | Cloudflare account ID for the R2 S3-compatible endpoint. |
| `R2_ACCESS_KEY_ID` | R2 access key used only by the server. |
| `R2_SECRET_ACCESS_KEY` | R2 secret key used only by the server. |
| `R2_BUCKET_NAME` | R2 bucket used for media. |
| `R2_PUBLIC_BASE_URL` | Public read URL or custom domain for the bucket, without a trailing slash. |

For local development, `SITE_URL` may be left empty and the app falls back to the current localhost request or `http://localhost:3000`. Production SEO URLs should always use the configured `SITE_URL`.

## Authentication

Members sign in at `/signin` with Google. Auth.js stores database sessions through Prisma, and the application resolves the current role from the PostgreSQL `User` record on protected server requests. Member profile data, RSVP activity and badges are tied to that database user rather than to a browser-supplied provider identifier.

Configure these authorised redirect URIs in the Google OAuth client:

```text
http://localhost:3000/api/auth/callback/google
https://YOUR_DEPLOYED_ORIGIN/api/auth/callback/google
```

Use the actual deployment origin in place of `YOUR_DEPLOYED_ORIGIN`. Keep `AUTH_SECRET` and Google credentials server-only; do not prefix them with `NEXT_PUBLIC_`.

## Database and migrations

The PostgreSQL schema is in [prisma/schema.prisma](prisma/schema.prisma). Existing content and profile changes are represented by checked-in migrations. Useful commands are:

```bash
yarn db:generate       # Regenerate Prisma Client after schema changes
yarn db:migrate        # Create/apply migrations during local development
yarn db:migrate:deploy # Apply checked-in migrations in deployment
yarn db:seed            # Add missing seed content and badge definitions
yarn db:studio          # Inspect the database locally
```

The seed is additive: it does not reset edited content, change roles or create fake member accounts.

## Cloudflare R2 media

The server creates short-lived presigned PUT URLs. Admin event covers, gallery images and story covers upload directly from the browser to R2; profile media uses the authenticated member’s server-derived prefix:

```text
profiles/{userId}/avatar/...
profiles/{userId}/banner/...
```

The browser cannot choose an arbitrary profile owner or storage prefix. Account deletion cleans the complete authenticated profile prefix before the database account is removed. Configure bucket CORS for the browser origins that use the admin and profile forms. A local policy can allow `PUT` from `http://localhost:3000` and the real deployed origin.

## Admin bootstrap and roles

Users start as `MEMBER`. `ADMIN` users manage events, gallery, stories, newsletter records and CMS uploads. `SUPER_ADMIN` users can also manage roles at `/admin/admins`.

To bootstrap the first super admin, sign in with Google once so the local `User` record exists, then deliberately promote that record through Prisma Studio:

```text
yarn db:studio
User → locate your account → role → SUPER_ADMIN → save
```

The equivalent SQL is:

```sql
UPDATE "User"
SET "role" = 'SUPER_ADMIN'
WHERE "email" = 'YOUR_EMAIL';

SELECT "email", "role"
FROM "User"
WHERE "email" = 'YOUR_EMAIL';
```

Do not add a real email address to source control or environment variables. The account must exist first, and direct database promotion is intended only for initial bootstrap or emergency recovery. Normal role management happens through `/admin/admins`, which protects the final remaining super admin from demotion.

## Scripts

```bash
yarn dev          # Start the development server
yarn lint         # Run ESLint
yarn typecheck    # Run TypeScript without emitting files
yarn build:dev    # Build without running database deployment
yarn build        # Run prisma migrate deploy, then build for production
yarn start        # Start the production server
yarn db:generate
yarn db:migrate
yarn db:migrate:deploy
yarn db:seed
yarn db:studio
```

## Deployment

Deploy the Next.js application with a reachable PostgreSQL database and the server-only Auth.js, Google OAuth and R2 variables configured in the deployment environment. Set `SITE_URL` to the real public HTTPS origin, add that origin’s Google callback URL, and run `yarn db:migrate:deploy` as part of the release process. Bootstrap the intended first `SUPER_ADMIN` deliberately after the account is created.

No production domain, database provider or infrastructure provider is assumed by this repository.

## License

The source code in this repository is licensed under the MIT License.

PH Otakus / Otaku NG names, logos, branding, photographs, illustrations, event artwork and other media assets are not covered by the MIT License unless explicitly stated otherwise. All rights to those assets are reserved by their respective owners.
