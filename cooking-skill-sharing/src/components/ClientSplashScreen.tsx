"use client";

import { useEffect, useState } from 'react';
import { SplashScreen } from './SplashScreen';

export default function ClientSplashScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Render nothing on the server
  }

  return <SplashScreen />; // Render SplashScreen only on the client
}
