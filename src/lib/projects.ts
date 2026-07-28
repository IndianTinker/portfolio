import { reader } from './reader';
import { parseVideo } from './video';

export type ProjectEntry = Awaited<
  ReturnType<typeof reader.collections.projects.all>
>[number];

/** First usable still image from a project's media list, for card thumbnails. */
export function coverThumb(media: ProjectEntry['entry']['media']): string | null {
  for (const item of media) {
    if (item.discriminant === 'image' || item.discriminant === 'imageUrl') {
      if (item.value.src) return item.value.src;
    } else if (item.discriminant === 'video') {
      const v = parseVideo(item.value.src);
      if (v.thumb) return v.thumb;
    }
  }
  return null;
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const all = await reader.collections.projects.all();
  return all.sort((a, b) => {
    const ao = a.entry.order ?? 100;
    const bo = b.entry.order ?? 100;
    if (ao !== bo) return ao - bo;
    return (b.entry.year ?? '').localeCompare(a.entry.year ?? '');
  });
}
