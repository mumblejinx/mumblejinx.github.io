import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export function OrientationLock() {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const portrait = window.innerHeight >= window.innerWidth;

      // ✅ Only treat small screens as phones
      const phone = window.innerWidth < 768;

      setIsPortrait(portrait);
      setIsPhone(phone);
    };

    // Initial check
    checkDevice();

    // Listen for changes
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // 🚫 LOCK ONLY PHONES IN LANDSCAPE
  if (isPhone && !isPortrait) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <Smartphone className="w-16 h-16 mb-4 animate-bounce rotate-90" />
        
        <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">
          Rotate Device
        </h2>

        <p className="text-gray-400 max-w-xs">
          This experience is optimized for vertical viewing.
          Please
