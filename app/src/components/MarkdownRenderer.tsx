import type { ReactNode } from 'react';

interface MarkdownRendererProps {
  markdown: string;
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

const parseInline = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns = [
    { type: 'link', regex: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/ },
    { type: 'bold', regex: /\*\*([^*]+)\*\*/ },
    { type: 'code', regex: /`([^`]+)`/ },
  ] as const;

  while (remaining.length > 0) {
    let nextMatch:
      | {
          type: (typeof patterns)[number]['type'];
          index: number;
          length: number;
          groups: string[];
        }
      | undefined;

    for (const pattern of patterns) {
      const match = pattern.regex.exec(remaining);
      if (!match || match.index < 0) {
        continue;
      }

      if (!nextMatch || match.index < nextMatch.index) {
        nextMatch = {
          type: pattern.type,
          index: match.index,
          length: match[0].length,
          groups: match.slice(1),
        };
      }
    }

    if (!nextMatch) {
      nodes.push(remaining);
      break;
    }

    if (nextMatch.index > 0) {
      nodes.push(remaining.slice(0, nextMatch.index));
    }

    if (nextMatch.type === 'link') {
      nodes.push(
        <a
          key={`inline-${key++}`}
          href={nextMatch.groups[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--apple-blue)] hover:underline"
        >
          {nextMatch.groups[0]}
        </a>
      );
    }

    if (nextMatch.type === 'bold') {
      nodes.push(
        <strong key={`inline-${key++}`} className="font-semibold text-[var(--apple-dark)]">
          {nextMatch.groups[0]}
        </strong>
      );
    }

    if (nextMatch.type === 'code') {
      nodes.push(
        <code
          key={`inline-${key++}`}
          className="px-1.5 py-0.5 rounded bg-black/5 text-[var(--apple-dark)] text-[0.95em]"
        >
          {nextMatch.groups[0]}
        </code>
      );
    }

    remaining = remaining.slice(nextMatch.index + nextMatch.length);
  }

  return nodes;
};

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  const slugCounts = new Map<string, number>();

  const getHeadingId = (value: string) => {
    const base = slugifyHeading(normalizeHeadingText(value)) || 'section';
    const count = slugCounts.get(base) || 0;
    slugCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };

  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) {
        i += 1;
      }
      blocks.push(
        <pre key={`block-${i}`} className="rounded-xl bg-black text-white p-4 overflow-x-auto">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      const headingText = line.slice(4);
      blocks.push(
        <h3
          id={getHeadingId(headingText)}
          key={`block-${i}`}
          className="text-2xl font-semibold text-[var(--apple-dark)] mt-8 mb-3 scroll-mt-28"
        >
          {parseInline(headingText)}
        </h3>
      );
      i += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      const headingText = line.slice(3);
      blocks.push(
        <h2
          id={getHeadingId(headingText)}
          key={`block-${i}`}
          className="text-3xl font-semibold text-[var(--apple-dark)] mt-10 mb-4 scroll-mt-28"
        >
          {parseInline(headingText)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      const headingText = line.slice(2);
      blocks.push(
        <h1
          id={getHeadingId(headingText)}
          key={`block-${i}`}
          className="text-4xl font-semibold text-[var(--apple-dark)] mt-10 mb-4 scroll-mt-28"
        >
          {parseInline(headingText)}
        </h1>
      );
      i += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push(
        <ul key={`block-${i}`} className="list-disc pl-6 space-y-2 text-[var(--apple-text)]">
          {items.map((item, idx) => (
            <li key={`li-${idx}`} className="leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const paragraphLines: string[] = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('- ') && !lines[i].trim().startsWith('```')) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push(
      <p key={`block-${i}`} className="text-lg leading-relaxed text-[var(--apple-text)]">
        {parseInline(paragraphLines.join(' '))}
      </p>
    );
  }

  return <div className="space-y-6">{blocks}</div>;
}
