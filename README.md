This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local database setup

Events, gallery albums/images, stories, newsletter subscribers and member accounts are stored in PostgreSQL through Prisma. For local development:

1. Create a PostgreSQL database named `ph_otakus` (or choose another name).
2. Copy `.env.example` to `.env` and update `DATABASE_URL` with your local credentials.
3. Apply the migrations with `yarn db:migrate` (or use `yarn db:migrate:deploy` in a deployed environment).
4. Load the existing PH Otakus events, gallery, stories and badge definitions with `yarn db:seed`.
5. Start the app with `yarn dev`.

Useful database commands are `yarn db:generate`, `yarn db:migrate:deploy`, and `yarn db:studio`.

## Member sign-in with Google

Member and administrator authentication use one Auth.js session backed by the Prisma adapter and Google OAuth. Authorization is resolved from the current PostgreSQL `User.role` on protected server requests.

Add these server-only variables to `.env`:

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

Generate a local secret with `openssl rand -base64 32`. In Google Cloud Console, create a Web OAuth client and add these authorised redirect URIs:

```text
http://localhost:3000/api/auth/callback/google
https://YOUR_PRODUCTION_DOMAIN/api/auth/callback/google
```

Replace `YOUR_PRODUCTION_DOMAIN` with the real deployed origin. Store the production values in Vercel as Sensitive environment variables. Never prefix Auth.js secrets or Google credentials with `NEXT_PUBLIC_` and never commit them.

Members start at `/signin`, complete `/profile/setup` on first sign-in, and can then use `/profile`, `/profile/edit`, and public `/members/[username]` pages. RSVP changes are tied to the local Prisma `User.id`; provider identifiers and emails are not shown on public profiles.

## Admin roles, content management and Cloudflare R2

Users start as `MEMBER`. The available database roles are `MEMBER`, `ADMIN` and `SUPER_ADMIN`. `ADMIN` users can manage events, gallery, stories, newsletter records and CMS uploads. `SUPER_ADMIN` users can also manage roles at `/admin/admins`. Roles are never inferred from an email address, Google claim or client input.

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

Do not add a real email address to source control or environment variables. The user must sign in first, and direct database promotion is intended only for the initial bootstrap or emergency recovery; normal administration happens through `/admin/admins`. The application protects the last remaining super admin from demotion, including concurrent role changes.

R2 credentials are server-only. Set `R2_PUBLIC_BASE_URL` to the public read URL or custom domain for the bucket. Profile media is stored under `profiles/{userId}/avatar/...` and `profiles/{userId}/banner/...`; the server derives this prefix from the Auth.js user and never accepts a browser-supplied owner ID.

Events, gallery images and story covers are uploaded directly from the browser to R2 using short-lived presigned PUT URLs. Configure the R2 bucket CORS policy to allow the browser origins that use the admin forms. For local development, a policy like this is sufficient:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://YOUR_PRODUCTION_DOMAIN"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Replace `https://YOUR_PRODUCTION_DOMAIN` with the real Vercel or custom-domain origin when deploying. Do not add a guessed production domain.

Gallery albums are managed at `/admin/gallery`; save an album first, then upload multiple images, edit alt text/captions, reorder them and publish. Stories are managed at `/admin/stories` and use Markdown for the body. Draft gallery albums and stories are never exposed by the public routes. Newsletter signups are persisted at `/admin/newsletter`; this phase stores subscriber records but does not send email.

The content migration is `prisma/migrations/20260819002000_add_content_management`, the member foundation is `prisma/migrations/20260819003000_add_member_platform`, and Phase 4B is `prisma/migrations/20260819004000_phase_4b_profile_roles`. Run `yarn db:generate` after schema changes, then `yarn db:migrate` locally or `yarn db:migrate:deploy` for Neon/production, followed by `yarn db:seed`. Seeding creates missing legacy albums/stories and badge definitions without resetting existing edited content, changing roles or creating fake users.

For production, deploy the application with the existing `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and R2 variables, run `yarn db:migrate:deploy`, then sign in once with the intended bootstrap Google account and promote it to `SUPER_ADMIN` using the Studio or SQL steps above. No bootstrap email environment variable is used.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

The source code in this repository is licensed under the MIT License.

PH Otakus / Otaku NG names, logos, branding, photographs, illustrations, event artwork, and other media assets are not covered by the MIT License unless explicitly stated otherwise. All rights to those assets are reserved by their respective owners.
