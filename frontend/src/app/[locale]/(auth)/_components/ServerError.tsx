"use client";

interface ServerErrorProps {
  /** Translated error message to display. Renders nothing when null. */
  message: string | null;
}

export default function ServerError({ message }: ServerErrorProps) {
  if (!message) return null;

  return (
    <div className="border border-red-900 bg-red-950/50 px-4 py-3">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red-400">
        {message}
      </p>
    </div>
  );
}
