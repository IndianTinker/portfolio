import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Storage: LOCAL while GitHub is down / Keystatic Cloud is not set up yet.
 * - Admin at /keystatic writes directly to files in this repo. No auth needed.
 * - Uploaded images land in public/images/** (committed to the repo).
 *
 * To go back to Cloud storage later:
 *   1. Create a project at https://keystatic.cloud, install its GitHub App on
 *      this repo, and set the slug below (currently a placeholder:
 *      'rohit-gupta/portfolio').
 *   2. Change storage back to: { kind: 'cloud' }
 *   3. Add allowed domains (localhost:4321 + the Vercel domain) in the
 *      Keystatic Cloud dashboard.
 *      4. Optionally re-upload images so they move to the Cloud CDN.
 */

// A single media item: an uploaded image, an external image URL, or a video
// link (YouTube / Vimeo). Videos and external images are never stored in the
// repo. Each item can optionally carry a caption. Rendered as a plain vertical
// list (no carousel).
const mediaItem = fields.conditional(
  fields.select({
    label: 'Type',
    options: [
      { label: 'Image (upload)', value: 'image' },
      { label: 'Image (external URL)', value: 'imageUrl' },
      { label: 'Video (YouTube / Vimeo link)', value: 'video' },
    ],
    defaultValue: 'image',
  }),
  {
    image: fields.object({
      src: fields.image({
        label: 'Image',
        directory: 'public/images/projects',
        publicPath: '/images/projects/',
        validation: { isRequired: true },
      }),
      caption: fields.text({ label: 'Caption', description: 'Optional' }),
    }),
    imageUrl: fields.object({
      src: fields.url({ label: 'Image URL', validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption', description: 'Optional' }),
    }),
    video: fields.object({
      src: fields.url({
        label: 'Video URL',
        description: 'YouTube or Vimeo link',
        validation: { isRequired: true },
      }),
      caption: fields.text({ label: 'Caption', description: 'Optional' }),
    }),
  }
);

const richTextBody = (label: string) =>
  fields.document({
    label,
    formatting: {
      inlineMarks: { bold: true, italic: true, code: true, strikethrough: true },
      listTypes: { ordered: true, unordered: true },
      headingLevels: [2, 3, 4],
      blockTypes: { blockquote: true, code: true },
      softBreaks: true,
    },
    dividers: true,
    links: true,
    images: {
      directory: 'public/images/content',
      publicPath: '/images/content/',
    },
  });

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Rohit Gupta — Portfolio' },
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { data: 'yaml', contentField: 'body' },
      columns: ['title', 'category', 'client', 'year', 'status', 'visible'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Category',
          description: 'What someone would commission this kind of work as',
          options: [
            { label: 'Installations & Exhibits', value: 'Installations & Exhibits' },
            { label: 'Physical Products & Prototypes', value: 'Physical Products & Prototypes' },
            { label: 'Speculative & Critical', value: 'Speculative & Critical' },
            { label: 'Digital Products & Platforms', value: 'Digital Products & Platforms' },
            { label: 'Generative & Data Visuals', value: 'Generative & Data Visuals' },
          ],
          defaultValue: 'Installations & Exhibits',
        }),
        client: fields.text({
          label: 'Client / Commissioned by',
          description: 'Leave blank for self-initiated work',
        }),
        year: fields.text({ label: 'Year', description: 'e.g. 2017 or 2023–2025' }),
        summary: fields.text({
          label: 'Summary',
          description: 'Short blurb shown on the homepage / list',
          multiline: true,
        }),
        featured: fields.checkbox({
          label: 'Featured on homepage',
          defaultValue: false,
        }),
        status: fields.select({
          label: 'Status',
          description: 'Upcoming / In progress entries surface on the homepage',
          options: [
            { label: 'Completed', value: 'Completed' },
            { label: 'In progress', value: 'In progress' },
            { label: 'Upcoming', value: 'Upcoming' },
          ],
          defaultValue: 'Completed',
        }),
        visible: fields.checkbox({
          label: 'Show on site',
          description: 'Uncheck to hide from all project lists',
          defaultValue: true,
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers appear first',
          defaultValue: 100,
        }),
        difficulty: fields.integer({
          label: 'Difficulty (1–5)',
          description: 'Your own rating — drives the sort control on /projects',
          validation: { min: 1, max: 5 },
          defaultValue: 3,
        }),
        fun: fields.integer({
          label: 'Fun (1–5)',
          description: 'Your own rating',
          validation: { min: 1, max: 5 },
          defaultValue: 3,
        }),
        popularity: fields.integer({
          label: 'Popularity (1–5)',
          description: 'Your own rating — swap in real metrics later if you get analytics',
          validation: { min: 1, max: 5 },
          defaultValue: 3,
        }),
        durationWeeks: fields.integer({
          label: 'Duration (weeks)',
          description: 'Rough effort, in weeks — leave blank if unknown',
          validation: { min: 0 },
        }),
        media: fields.array(mediaItem, {
          label: 'Media',
          description: 'Images and video links, shown top-to-bottom on the project page',
          itemLabel: (props) => {
            const v = props.value;
            const cap = (v.value as any)?.caption;
            return cap || v.discriminant;
          },
        }),
        awards: fields.array(
          fields.object({
            label: fields.text({ label: 'Award', validation: { isRequired: true } }),
            url: fields.url({ label: 'Link', description: 'Optional' }),
          }),
          {
            label: 'Awards',
            itemLabel: (props) => props.fields.label.value || 'Award',
          }
        ),
        body: richTextBody('Body'),
      },
    }),
    caseStudies: collection({
      label: 'Case studies (detailed write-ups)',
      slugField: 'title',
      path: 'src/content/case-studies/*',
      format: { data: 'yaml', contentField: 'content' },
      columns: ['title', 'project'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'Slug',
            description:
              'Must match the slug of the project this write-up belongs to',
          },
        }),
        project: fields.relationship({
          label: 'Project',
          description: 'The project this detailed write-up belongs to',
          collection: 'projects',
        }),
        content: richTextBody('Detailed write-up'),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'src/content/home',
      schema: {
        greeting: fields.text({ label: 'Greeting', defaultValue: 'Hello!' }),
        intro: fields.text({
          label: 'Intro line',
          multiline: true,
          defaultValue:
            'I am a designer and an engineer. I like to build things for creative enquiry.',
        }),
        companies: fields.array(
          fields.object({
            name: fields.text({ label: 'Company name', validation: { isRequired: true } }),
            logo: fields.image({
              label: 'Logo',
              directory: 'public/images/companies',
              publicPath: '/images/companies/',
            }),
            url: fields.url({ label: 'Website', description: 'Optional' }),
          }),
          {
            label: 'Companies & collaborators',
            itemLabel: (p) => p.fields.name.value || 'Company',
          }
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({
              label: 'Quote',
              multiline: true,
              validation: { isRequired: true },
            }),
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            role: fields.text({
              label: 'Role / context',
              description: 'e.g. Curator, Museum X',
            }),
            url: fields.url({ label: 'Link', description: 'Optional' }),
          }),
          {
            label: 'Testimonials',
            itemLabel: (p) => p.fields.name.value || 'Testimonial',
          }
        ),
      },
    }),
    about: singleton({
      label: 'About page',
      path: 'src/content/about',
      format: { data: 'yaml', contentField: 'bio' },
      schema: {
        photo: fields.conditional(
          fields.select({
            label: 'Photo type',
            options: [
              { label: 'Upload', value: 'image' },
              { label: 'External URL', value: 'imageUrl' },
            ],
            defaultValue: 'imageUrl',
          }),
          {
            image: fields.image({
              label: 'Photo',
              directory: 'public/images/about',
              publicPath: '/images/about/',
            }),
            imageUrl: fields.url({ label: 'Photo URL' }),
          }
        ),
        present: fields.text({
          label: 'Present',
          description: 'What you are working on now',
          multiline: true,
        }),
        presentLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.url({ label: 'URL' }),
          }),
          { label: 'Present — links', itemLabel: (p) => p.fields.label.value || 'Link' }
        ),
        experience: fields.array(
          fields.object({
            period: fields.text({ label: 'Period' }),
            role: fields.text({ label: 'Role / place' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Experience', itemLabel: (p) => p.fields.role.value || p.fields.period.value }
        ),
        education: fields.array(
          fields.object({
            period: fields.text({ label: 'Period' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Education', itemLabel: (p) => p.fields.detail.value || p.fields.period.value }
        ),
        exhibitions: fields.array(
          fields.object({
            year: fields.text({ label: 'Year' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Exhibitions & talks', itemLabel: (p) => p.fields.detail.value || p.fields.year.value }
        ),
        publications: fields.array(
          fields.object({
            detail: fields.text({ label: 'Citation', multiline: true }),
          }),
          { label: 'Publications', itemLabel: (p) => p.fields.detail.value || 'Publication' }
        ),
        awards: fields.array(
          fields.object({
            year: fields.text({ label: 'Year' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Awards', itemLabel: (p) => p.fields.detail.value || p.fields.year.value }
        ),
        interests: fields.array(
          fields.object({
            heading: fields.text({ label: 'Heading' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Interests', itemLabel: (p) => p.fields.heading.value || 'Interest' }
        ),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.url({ label: 'URL' }),
          }),
          { label: 'Contact links', itemLabel: (p) => p.fields.label.value || 'Link' }
        ),
        bio: fields.document({
          label: 'Bio',
          formatting: { inlineMarks: { bold: true, italic: true }, softBreaks: true },
          links: true,
        }),
      },
    }),
  },
});
