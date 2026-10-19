import SocketProvider from "@/components/SocketProvider";

export const instant = false;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}
