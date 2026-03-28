/**
 * Route-level loading UI — shown during navigation between pages.
 * Next.js automatically wraps page content in a Suspense boundary
 * and shows this component while the new page chunk loads.
 */

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--vita-background, #fff)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-current"
          style={{
            color: "var(--vita-primary, #171717)",
            borderTopColor: "transparent",
          }}
        />
        <p
          className="text-sm font-medium"
          style={{ color: "var(--vita-text-muted, #737373)" }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
