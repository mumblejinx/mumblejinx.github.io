/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, WorkSubsection, AboutSubsection, Subsection } from './constants';
import { AssetImage } from './components/AssetImage';
import { OrientationLock } from './components/OrientationLock';

export default function App() {
  const [section, setSection] = useState<Section>(Section.INTRO);
  const [subsection, setSubsection] = useState<Subsection>(null);
  const [animKey, setAnimKey] = useState(0);
  const [isExitingToIntro, setIsExitingToIntro] = useState(false);
  const [headerHeight, setHeaderHeight] = useState('80px');
  const [lightbox, setLightbox] = useState<{ images: any[], index: number } | null>(null);

  // ✅ SWIPE STATE (SAFE)
  const touchStartX = useRef(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'OPEN_LIGHTBOX') {
        setLightbox({
          images: event.data.images,
          index: event.data.index
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox) return;

      if (e.key === 'ArrowRight') {
        setLightbox(prev =>
          prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
        );
      }

      if (e.key === 'ArrowLeft') {
        setLightbox(prev =>
          prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null
        );
      }

      if (e.key === 'Escape') {
        setLightbox(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  useEffect(() => {
    const handleResize = () => {
      setHeaderHeight(window.innerWidth < 768 ? '52px' : '80px');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (section === Section.WORK) {
      setSubsection(WorkSubsection.ANALOG);
    } else if (section === Section.ABOUT) {
      setSubsection(AboutSubsection.WORD);
    } else {
      setSubsection(null);
    }
  }, [section]);

  const handleSectionChange = (newSection: Section) => {
    if (newSection === Section.INTRO && section === Section.WORK && window.innerWidth < 768) {
      setIsExitingToIntro(true);
      setTimeout(() => {
        setSection(Section.INTRO);
        setIsExitingToIntro(false);
        setAnimKey(prev => prev + 1);
      }, 500);
      return;
    }

    if (newSection === Section.INTRO) {
      setAnimKey(prev => prev + 1);
    }

    setSection(newSection);
  };

  const handleSubsectionChange = (newSubsection: Subsection) => {
    setSubsection(newSubsection);
  };

  const getSubsectionFile = () => {
    if (section === Section.SUPPORT) return '/subsections/support.html';
    if (!subsection) return null;
    return `/subsections/${subsection.toLowerCase()}.html`;
  };

  // ✅ SWIPE HANDLERS (ISOLATED + SAFE)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    if (!lightbox) return;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left → next
        setLightbox(prev =>
          prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
        );
      } else {
        // swipe right → prev
        setLightbox(prev =>
          prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">

      {/* ========================= */}
      {/* GLOBAL LIGHTBOX */}
      {/* ========================= */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            // ✅ SWIPE ATTACHED HERE
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}

            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white z-[110]"
            >
              ✕
            </button>

            {/* LEFT */}
            <button
              onClick={() =>
                setLightbox(prev =>
                  prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null
                )
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white z-[110]"
            >
              ←
            </button>

            {/* RIGHT */}
            <button
              onClick={() =>
                setLightbox(prev =>
                  prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
                )
              }
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white z-[110]"
            >
              →
            </button>

            {/* IMAGE */}
            <motion.img
              key={lightbox.images[lightbox.index].full}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={lightbox.images[lightbox.index].full}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <OrientationLock />

      {/* KEEP EVERYTHING ELSE EXACTLY THE SAME */}
      {/* (No changes below this line) */}

      <header className="absolute top-0 left-0 right-0 bg-black text-white p-4 z-50 h-auto md:h-20 flex items-center">
        <div className="w-full flex justify-between items-center md:justify-center md:relative">
          <button onClick={() => handleSectionChange(Section.INTRO)}>
            <AssetImage src="/jakegalm.jpg" fallback="Jake Galm" className="h-5 md:h-8" />
          </button>

          <nav className="flex gap-x-8">
            <button onClick={() => handleSectionChange(Section.WORK)}>
              <AssetImage src="/work.jpg" fallback="Work" className="h-5 md:h-8" />
            </button>
            <button onClick={() => handleSectionChange(Section.ABOUT)}>
              <AssetImage src="/about.jpg" fallback="About" className="h-5 md:h-8" />
            </button>
            <button onClick={() => handleSectionChange(Section.SUPPORT)}>
              <AssetImage src="/support.jpg" fallback="Support" className="h-5 md:h-8" />
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-grow pt-20">
        {getSubsectionFile() && (
          <iframe
            src={getSubsectionFile()!}
            className="w-full h-full border-none"
          />
        )}
      </div>
    </div>
  );
}
