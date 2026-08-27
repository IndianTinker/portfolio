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
  return all
    .filter((p) => p.entry.visible !== false)
    .sort((a, b) => {
      const ao = a.entry.order ?? 100;
      const bo = b.entry.order ?? 100;
      if (ao !== bo) return ao - bo;
      return (b.entry.year ?? '').localeCompare(a.entry.year ?? '');
    });
}

/** First four-digit year in a free-text year field like '2023–2025'. */
export function startYear(y: string | null): number {
  return Number(y?.match(/\d{4}/)?.[0] ?? 0);
}

/** Numeric score for the sort control; unrated projects default to 3 (0 for duration). */
export function score(
  entry: ProjectEntry['entry'],
  key: 'difficulty' | 'fun' | 'popularity' | 'durationWeeks'
): number {
  const v = entry[key];
  return typeof v === 'number' ? v : key === 'durationWeeks' ? 0 : 3;
}
