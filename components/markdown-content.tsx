import type { ReactNode } from "react";

function safeHref(value: string): string | null {
  try {
    const url = new URL(value, "https://ph-otakus.local");
    if (["http:", "https:", "mailto:"].includes(url.protocol)) return value;
  } catch {
    return null;
  }
  return null;
}

function renderInline(value: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_)/;
  const match = pattern.exec(value);
  if (!match || match.index === undefined) return [value];

  const before = value.slice(0, match.index);
  const after = value.slice(match.index + match[0].length);
  const children = match[2];
  const link = match[3] ? safeHref(match[3]) : null;
  let node: ReactNode;

  if (match[3]) {
    node = link ? <a className="underline decoration-brand-red underline-offset-4 hover:text-brand-red" href={link} rel="noreferrer" target="_blank">{children}</a> : children;
  } else if (match[4]) {
    node = <code className="bg-brand-paper-dark px-1.5 py-0.5 font-mono text-[0.9em]">{match[4]}</code>;
  } else if (match[5] || match[6]) {
    node = <strong>{match[5] ?? match[6]}</strong>;
  } else {
    node = <em>{match[7] ?? match[8]}</em>;
  }

  return [
    ...(before ? renderInline(before, `${keyPrefix}-before`) : []),
    <span key={`${keyPrefix}-${match.index}`}>{node}</span>,
    ...(after ? renderInline(after, `${keyPrefix}-after`) : []),
  ];
}

type MarkdownBlock =
  | { type: "paragraph"; lines: string[] }
  | { type: "heading"; level: number; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "code"; language: string; text: string }
  | { type: "hr" };

function parseBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^\s*```\s*([\w-]*)\s*$/);
    if (fence) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index] ?? "")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code", language: fence[1] ?? "", text: codeLines.join("\n") });
      continue;
    }

    const heading = line.match(/^\s*(#{1,3})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (/^\s*((\*\s*){3,}|(-\s*){3,}|(_\s*){3,})$/.test(line)) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^\s*>/.test(lines[index] ?? "")) {
        quoteLines.push((lines[index] ?? "").replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }

    const listMatch = line.match(/^\s*([-+*]|\d+[.)])\s+(.+)$/);
    if (listMatch) {
      const listType = /^\d/.test(listMatch[1]) ? "ol" : "ul";
      const items: string[] = [];
      while (index < lines.length) {
        const item = (lines[index] ?? "").match(/^\s*([-+*]|\d+[.)])\s+(.+)$/);
        if (!item || (/^\d/.test(item[1]) ? "ol" : "ul") !== listType) break;
        items.push(item[2]);
        index += 1;
      }
      blocks.push({ type: listType, items });
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;
    while (index < lines.length && (lines[index] ?? "").trim()) {
      const next = lines[index] ?? "";
      if (/^\s*```|^\s*#{1,3}\s|^\s*>|^\s*([-+*]|\d+[.)])\s+/.test(next)) break;
      paragraphLines.push(next.trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", lines: paragraphLines });
  }

  return blocks;
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="grid gap-6 text-[1.05rem] leading-[1.8] text-brand-ink [&_a]:transition-colors [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-6 [&_code]:text-brand-ink [&_h2]:font-display [&_h2]:text-[clamp(2.2rem,4vw,4rem)] [&_h2]:leading-[0.95] [&_h2]:uppercase [&_h3]:font-display [&_h3]:text-[clamp(1.8rem,3vw,3rem)] [&_h3]:leading-[1] [&_h3]:uppercase [&_li]:ml-6 [&_li]:pl-2 [&_ol]:list-decimal [&_ul]:list-disc">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") {
          const Heading = block.level === 1 ? "h2" : block.level === 2 ? "h2" : "h3";
          return <Heading key={key}>{renderInline(block.text, key)}</Heading>;
        }
        if (block.type === "paragraph") return <p key={key}>{renderInline(block.lines.join(" "), key)}</p>;
        if (block.type === "quote") return <blockquote key={key}>{renderInline(block.lines.join(" "), key)}</blockquote>;
        if (block.type === "hr") return <hr className="border-[var(--line)]" key={key} />;
        if (block.type === "code") return <pre className="overflow-x-auto bg-brand-ink p-5 text-sm leading-[1.6] text-white" key={key}><code>{block.text}</code></pre>;

        const List = block.type === "ol" ? "ol" : "ul";
        return <List key={key}>{block.items.map((item, itemIndex) => <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>)}</List>;
      })}
    </div>
  );
}
