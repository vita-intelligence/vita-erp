"use client";

/**
 * GroupRenderer — renders a group element as a card-like container
 * with its label, description, and child fields.
 */

type GroupRendererProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

export function GroupRenderer({
  label,
  description,
  children,
}: GroupRendererProps) {
  return (
    <fieldset
      className="flex flex-col gap-4 rounded-vita-lg p-4"
      style={{
        border: "1px solid var(--vita-neutral-200)",
        background: "var(--vita-background)",
      }}
    >
      <legend
        className="px-2 text-sm font-semibold"
        style={{ color: "var(--vita-text-primary)" }}
      >
        {label}
      </legend>
      {description && (
        <p
          className="-mt-2 text-xs"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {description}
        </p>
      )}
      {children}
    </fieldset>
  );
}
