export interface ParsedVideo {
  provider: 'youtube' | 'vimeo' | 'other';
  embedUrl: string;
  thumb: string | null;
}

export function parseVideo(url: string): ParsedVideo {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    // YouTube
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return youtube(id);
    }
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.split('/').pop() || '';
      return youtube(id);
    }

    // Vimeo
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop() || '';
      return {
        provider: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
        thumb: null,
      };
    }
  } catch {
    /* fall through */
  }
  return { provider: 'other', embedUrl: url, thumb: null };
}

function youtube(id: string): ParsedVideo {
  return {
    provider: 'youtube',
    embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}
