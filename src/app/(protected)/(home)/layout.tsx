import { HomeShell } from "./_components/HomeShell";

export const instant = false;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeShell>{children}</HomeShell>;
}
