import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export function OrientationLock() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
      
      setIsLandscape(landscape);
      setIsMobile(mobile);
    };

    // Initial check
    checkOrientation();

    // Listen for resize/orientation change
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Attempt to lock orientation via API (may be blocked in iframe)
    const screenAny = screen as any;
    if (typeof screen !== 'undefined' && screenAny.orientation && screenAny.orientation.lock) {
      try {
        // We try to lock to portrait-primary
        // Note: This usually requires fullscreen mode, so it might fail silently or throw
        screenAny.orientation.lock('portrait-primary').catch(() => {
          // Silently fail if blocked by browser/iframe
        });
      } catch (e) {
        // Ignore errors
      }
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (isMobile && isLandscape) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <Smartphone className="w-16 h-16 mb-4 animate-bounce rotate-90" />
        <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">Orientation Locked</h2>
        <p className="text-gray-400 max-w-xs">
          This experience is optimized for portrait mode. Please rotate your device back to continue.
        </p>
      </div>
    );
  }

  return null;
}
