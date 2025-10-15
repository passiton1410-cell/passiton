'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface TermsCheckerProps {
  children: React.ReactNode;
}

export default function TermsChecker({ children }: TermsCheckerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    checkTermsAcceptance();
  }, [pathname]);

  const checkTermsAcceptance = async () => {
    // Skip check for public routes
    const isPublicPath =
      pathname === '/' ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/terms') ||
      pathname.startsWith('/accept-terms') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.gif');

    if (isPublicPath) {
      setShouldRender(true);
      setIsChecking(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!data.loggedIn) {
        // Not logged in, redirect to login
        router.push('/auth/login');
        return;
      }

      if (!data.user.termsAccepted && !pathname.startsWith('/accept-terms')) {
        // Terms not accepted and not on accept-terms page, redirect
        router.push('/accept-terms');
        return;
      }

      // All checks passed, render the content
      setShouldRender(true);
    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, redirect to login
      router.push('/auth/login');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf7ed] via-[#E0D5FA] to-[#ffe9fa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3DF6] mx-auto"></div>
          <p className="mt-4 text-[#5B3DF6] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return shouldRender ? <>{children}</> : null;
}