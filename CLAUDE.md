# Portfolio — Rohit Gupta

A personal portfolio and "running record", rebuilt from static HTML into **Astro + Keystatic**. Design language: **faithful port of the original Tachyons site** — `sans-serif` (browser default), hairline rules (2px on nav/footer bars, 1px on section heads), light-purple `#a463f2` rich-text links (dim on hover), light-gray pill tags. Hero is a single plain uniform heading (no gradients, no per-word spans). Page titles (About, Projects) are `f-subheadline` = 5rem desktop / 1.5rem mobile; nav brand `f3` bold, nav links `f5`. Tagline: *Telling stories through making.*

Follow YAGNI principles and prioritise one line solutions.

## Stack

- **Astro 7** (static output) + **Vercel adapter**. Content pages are prerendered (SSG); the Keystatic admin + API run as serverless routes on Vercel.
- **Keystatic** CMS in **Cloud storage** mode:
  - Structured content (YAML + Markdoc) is committed to this repo under `src/content/`.
  - Uploaded images are hosted on the **Keystatic Cloud CDN** — NOT in the repo. External image URLs and video links are also never stored in the repo.
- **React 19** (used server-side only, for Keystatic + rich-text rendering via `Prose.tsx`).

## Architecture

```
keystatic.config.tsx      CMS schema (collections + singletons), Cloud storage
astro.config.mjs          static output, vercel adapter, react + keystatic integrations
src/
  content/                Keystatic-managed content (committed to repo)
    home.yaml             home singleton (greeting, intro)
    about.mdoc            about singleton (frontmatter data + bio body)
    projects/*.mdoc       one file per project (frontmatter + body)
    case-studies/*.mdoc   detailed write-ups, linked to a project by relationship
  lib/
    reader.ts             Keystatic reader (reads local content at build time)
    projects.ts           getProjects(), coverThumb()
    video.ts              parse YouTube/Vimeo URLs → embed + thumbnail
  layouts/Base.astro      shell: nav + footer + global styles
  components/
    Nav / Footer          chrome
    ProjectCard.astro     list/card
    MediaList.astro       vertical list of images/videos, each opens the lightbox
    Lightbox.astro        dark blurred-backdrop modal (vanilla JS, one per page)
    Prose.tsx             renders Keystatic rich text (DocumentRenderer, SSR)
  pages/
    index.astro           hero + featured projects
    projects/index.astro  all projects
    projects/[slug].astro project page: media list + body + awards + details link
    projects/[slug]/details.astro   detailed write-up (from case-studies)
    about.astro           about page
_legacy/                  the OLD static site, kept as the migration source of truth
```

### Content model (important)

- **On-disk format for any entry with a rich-text (content) field is a single flat `{slug}.mdoc` file**: YAML frontmatter for data + a Markdoc body for the one content field. Keystatic allows only ONE content field per entry — that is why the detailed write-up is a separate `caseStudies` collection rather than a second body on the project.
- A project's **media** is a plain vertical list (no carousel). Each item is an uploaded image, an external image URL, or a video link (YouTube/Vimeo). Clicking any item opens the lightbox.
- **Awards** are a small structured list (label + optional link) on each project.
- A **case study** (detailed write-up) links to a project via a `relationship` field whose value must equal the project slug. If one exists, the project page shows a "Read the detailed write-up" link to `/projects/{slug}/details`.

## Commands

```bash
npm run dev        # local dev at :4321 (also serves /keystatic admin)
npm run build      # static build + vercel output
npm run preview    # preview the build
```

## Status (2026-07-27)

Built and passing `astro build`. All 13 projects + About migrated from `_legacy`.
Deployment + Keystatic Cloud connection are **manual steps not yet done** — see
`docs/plans/ROADMAP.md`.

## Conventions

- Design system lives in `src/styles/global.css`, porting the original Tachyons look:
  `--font-sans: sans-serif`; `--accent: #aa235e` (link-underline hover); `--link: #a463f2`
  (light-purple) for `.prose a` rich-text links, no underline, dims on hover;
  hero is a single plain heading (gradients removed);
  `--surface: #eee` (light-gray) for pill tags. Rules: `.rule`/`.rule-faint` = 1px
  (section heads); nav + footer bars are 2px. Hand-written CSS only — no Tailwind /
  no heavy UI frameworks.
- Media/images the user will re-upload via Keystatic Cloud; legacy `imgur`/`giphy`
  URLs in migrated content are placeholders.
