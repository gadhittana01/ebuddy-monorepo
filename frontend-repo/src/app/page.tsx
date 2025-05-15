'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingIndicator } from '@/components/atoms/LoadingIndicator';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return <LoadingIndicator height="100vh" />;
}
