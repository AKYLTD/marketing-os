import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';
import SessionWrapper from '@/components/SessionWrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  const userData = {
    name: session.user?.name || 'User',
    email: session.user?.email || '',
    tier: (session.user as Record<string, unknown>)?.tier as string || 'enterprise',
  };

  return (
    <SessionWrapper>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={userData} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <ChatPanel user={userData} />
      </div>
    </SessionWrapper>
  );
}
