import { redirect } from "next/navigation";

/**
 * Root page — redirects to dashboard.
 *
 * This is a server component (no "use client") so the redirect
 * happens before any client-side JS loads.
 */
export default function RootPage() {
  redirect("/dashboard");
}
