"use client";

/**
 * RichText — renders text as plain text or HTML based on content.
 *
 * If the text contains HTML tags, renders via dangerouslySetInnerHTML
 * with sanitization of script/event-handler content.
 * Otherwise renders as plain text (no overhead).
 */

const HTML_TAG_REGEX = /<[a-z][\s\S]*?>/i;

/** Strips <script> tags and on* event attributes for basic XSS prevention. */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");
}

type RichTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "p" | "span" | "label" | "div";
  htmlFor?: string;
};

export function RichText({
  text,
  className,
  style,
  as: Tag = "span",
  htmlFor,
}: RichTextProps) {
  if (HTML_TAG_REGEX.test(text)) {
    return (
      <Tag
        className={className}
        style={style}
        htmlFor={htmlFor}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized rich text
        dangerouslySetInnerHTML={{ __html: sanitize(text) }}
      />
    );
  }

  return (
    <Tag className={className} style={style} htmlFor={htmlFor}>
      {text}
    </Tag>
  );
}
