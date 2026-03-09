export interface MarkdownHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

const normalizeHeadingText = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();

const slugifyHeading = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export const extractMarkdownHeadings = (markdown: string): MarkdownHeading[] => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const slugCounts = new Map<string, number>();
  const headings: MarkdownHeading[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('####')) {
      continue;
    }

    let level: 1 | 2 | 3 | null = null;
    let content = '';

    if (line.startsWith('# ')) {
      level = 1;
      content = line.slice(2);
    } else if (line.startsWith('## ')) {
      level = 2;
      content = line.slice(3);
    } else if (line.startsWith('### ')) {
      level = 3;
      content = line.slice(4);
    }

    if (!level) {
      continue;
    }

    const text = normalizeHeadingText(content);
    const base = slugifyHeading(text) || 'section';
    const count = slugCounts.get(base) || 0;
    slugCounts.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;

    headings.push({ id, text, level });
  }

  return headings;
};
