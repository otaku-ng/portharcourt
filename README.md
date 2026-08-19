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

Events, gallery albums/images, stories and newsletter subscribers are stored in PostgreSQL through Prisma. For local development:

1. Create a PostgreSQL database named `ph_otakus` (or choose another name).
2. Copy `.env.example` to `.env` and update `DATABASE_URL` with your local credentials.
3. Apply the migrations with `yarn db:migrate` (or use `yarn db:migrate:deploy` in a deployed environment).
4. Load the existing PH Otakus events, gallery and stories with `yarn db:seed`.
5. Start the app with `yarn dev`.

Useful database commands are `yarn db:generate`, `yarn db:migrate:deploy`, and `yarn db:studio`.

## Admin content management and Cloudflare R2

Phase 2B adds a temporary server-side admin gate at `/admin/login`. Set `ADMIN_PASSWORD` and a long random `ADMIN_SESSION_SECRET` in `.env` before using it. R2 credentials are server-only. Set `R2_PUBLIC_BASE_URL` to the public read URL or custom domain for the bucket.

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

The content migration is `prisma/migrations/20260819002000_add_content_management`. Run `yarn db:generate` after schema changes, then `yarn db:migrate` locally or `yarn db:migrate:deploy` for Neon/production, followed by `yarn db:seed`. Seeding creates missing legacy albums/stories without resetting existing edited content.

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
