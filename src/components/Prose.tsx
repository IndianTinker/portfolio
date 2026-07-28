import { DocumentRenderer } from '@keystatic/core/renderer';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof DocumentRenderer>;

// Server-rendered rich text. Rendered by Astro to static HTML (no hydration).
export default function Prose({ document, ...rest }: Props) {
  return (
    <div className="prose">
      <DocumentRenderer document={document} {...rest} />
    </div>
  );
}
