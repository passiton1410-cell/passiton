'use client';

import { useState, useEffect } from 'react';
import { NavBar } from './NavBar';
import Footer from './Footer';
import SplashScreen from './SplashScreen';
import { ClientNavBarWrapper } from './ClientNavBarWrapper';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('splashShown');
    if (alreadyShown) {
      setShowSplash(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleComplete} />;
  }

  return (
    <>
      <ClientNavBarWrapper />
      <main>{children}</main>
      <Footer />
    </>
  );
}
