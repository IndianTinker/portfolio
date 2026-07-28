# Portfolio revamp — roadmap

Status as of 2026-07-27. Branch: `astro-revamp`.

## Done

- [x] Scaffold Astro 7 + React 19 + Keystatic + Vercel adapter.
- [x] Keystatic schema (Cloud storage): `projects`, `caseStudies` collections; `home`, `about` singletons.
- [x] Design system (minimal B&W) + layout, nav, footer, lightbox.
- [x] Pages: home, projects list, project detail, detailed write-up, about.
- [x] Home hero: minimal statement with gradient accent words (no canvas effect —
      the canvasui.dev Bubble was removed because its refraction needs an experimental
      Chrome-only origin-trial API and was otherwise an inert overlay).
- [x] Migrated all 13 projects + full About from `_legacy`.
- [x] One sample case study (EmoSpace) proving the detail-page flow.
- [x] `astro build` passes; dev server routes verified (incl. `/keystatic`).

## Manual steps YOU need to do (blocking go-live)

1. **Create a Keystatic Cloud project**
   - Go to https://keystatic.cloud → create a team + project.
   - Copy the `team/project` slug.
   - Set it in `keystatic.config.tsx` → `KEYSTATIC_CLOUD_PROJECT` (currently the
     placeholder `rohit-gupta/portfolio`).
   - In the Keystatic Cloud dashboard, add allowed domains (localhost:4321 and the
     Vercel domain) so auth + image uploads work.

2. **Deploy to Vercel**
   - Import the GitHub repo `IndianTinker/portfolio` in Vercel.
   - Framework preset: Astro. Build: `npm run build`. Output is handled by the
     `@astrojs/vercel` adapter automatically.
   - No env vars are required for Cloud storage auth (Keystatic Cloud handles it),
     but confirm the deployed domain is registered in Keystatic Cloud (step 1).

3. **Point the domain** (rohitg.in or a subdomain) at Vercel when ready. The old
   site stays live until you switch DNS.

## Decisions made during the build (flag if you disagree)

- **Extra media type "external image URL"** was added alongside "upload image" and
  "video link", purely so the legacy imgur/giphy images could be migrated without
  re-uploading dozens of files. Remove it from `keystatic.config.tsx` (the
  `mediaItem` conditional) if you only ever want uploads + video links.
- **Detailed write-ups are a separate `caseStudies` collection**, linked to a
  project by a relationship field, because Keystatic allows only one rich-text
  content field per entry. In the CMS you create a "Case study" whose slug/relationship
  matches the project.
- **"Other projects" (external blog links to rohitg.in)** were NOT imported as
  project entries — they are outbound links, not case studies. Options for later:
  add them as minimal projects, or build a separate "More / Writing" link list.
  The list of them is preserved in `_legacy/otherProjects.html`.
- Migrated project bodies use the **legacy imgur/giphy image URLs as placeholders**.
  Re-upload real images through Keystatic (they'll move to the Cloud CDN).

## Nice-to-haves / backlog

- [ ] Colophon page (old `_legacy/colo.html`).
- [ ] Per-project multiple images (currently 1–2 migrated each; add the rest via CMS).
- [ ] OG images / richer SEO.
- [ ] Delete `_legacy/` once you're happy nothing else needs porting.
- [ ] Re-add the country-based greeting (old home did this) if wanted.
