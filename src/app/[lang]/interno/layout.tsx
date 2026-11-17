import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internal Analytics Opt-Out",
  robots: { index: false, follow: false },
};

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
