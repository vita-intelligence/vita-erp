/**
 * Badge style builder — generates CSSProperties from badge tokens.
 */

export function badgeStyle(
  bg: string,
  color: string,
  border?: string,
): React.CSSProperties {
  return {
    borderRadius: "var(--vita-badge-radius)",
    fontWeight:
      "var(--vita-badge-font-weight)" as React.CSSProperties["fontWeight"],
    fontSize: "var(--vita-badge-font-size)",
    letterSpacing: "var(--vita-badge-letter-spacing)",
    textTransform:
      "var(--vita-badge-text-transform)" as React.CSSProperties["textTransform"],
    paddingLeft: "var(--vita-badge-padding-x)",
    paddingRight: "var(--vita-badge-padding-x)",
    paddingTop: "var(--vita-badge-padding-y)",
    paddingBottom: "var(--vita-badge-padding-y)",
    background: bg,
    color,
    borderTopWidth: "var(--vita-badge-border-top)",
    borderRightWidth: "var(--vita-badge-border-right)",
    borderBottomWidth: "var(--vita-badge-border-bottom)",
    borderLeftWidth: "var(--vita-badge-border-left)",
    borderStyle:
      "var(--vita-badge-border-style)" as React.CSSProperties["borderStyle"],
    borderColor: border ?? "transparent",
    display: "inline-block",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  };
}
