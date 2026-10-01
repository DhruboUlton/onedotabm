'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { portalLogoutAction } from '@/app/project-access/actions';

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await portalLogoutAction();
        router.push('/project-access');
        router.refresh();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-white text-xs font-medium text-[#555555] hover:text-[#111111]"
    >
      <LogOut className="w-3.5 h-3.5" /> Sign out
    </button>
  );
}
