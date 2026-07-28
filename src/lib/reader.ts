import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

// Reads structured content from the local repo at build time.
export const reader = createReader(process.cwd(), keystaticConfig);
