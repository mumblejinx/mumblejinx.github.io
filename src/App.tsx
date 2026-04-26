/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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

  const [lightbox, setLightbox] = useState<{
    images: any[],
    index: number
  } | null>(null);

  /* =========================
     LIGHTBOX MESSAGE LISTENER
  ========================= */
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

  /* =========================
     KEYBOARD CONTROLS
  ========================= */
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
          prev ? {
            ...prev,
            index: (prev.index - 1 + prev.images.length) % prev.images.length
          } : null
        );
      }

      if (e.key === 'Escape') {
        setLightbox(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  /* =========================
     ✅ TOUCH SWIPE (LIGHTBOX ONLY)
  ========================= */
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!lightbox) return;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!lightbox) return;

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // swipe left → next
          setLightbox(prev =>
            prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
          );
        } else {
          // swipe right → prev
          setLightbox(prev =>
            prev ? {
              ...prev,
              index: (prev.index - 1 + prev.images.length) % prev.images.length
            } : null
          );
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lightbox]);

  /* =========================
     HEADER HEIGHT
  ========================= */
  useEffect(() => {
    const handleResize = () => {
      setHeaderHeight(window.innerWidth < 768 ? '52px' : '80px');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* =========================
     SUBSECTION RESET
  ========================= */
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">

      {/* =========================
         GLOBAL LIGHTBOX
      ========================= */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* CLOSE */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white text-3xl z-[110]"
            >
              ✕
            </button>

            {/* PREV */}
            <button
              onClick={() =>
                setLightbox(prev =>
                  prev
                    ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }
                    : null
                )
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl z-[110]"
            >
              ←
            </button>

            {/* NEXT */}
            <button
              onClick={() =>
                setLightbox(prev =>
                  prev
                    ? { ...prev, index: (prev.index + 1) % prev.images.length }
                    : null
                )
              }
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl z-[110]"
            >
              →
            </button>

            <motion.img
              key={lightbox.images[lightbox.index].full}
              src={lightbox.images[lightbox.index].full}
              className="max-w-[90vw] max-h-[80vh] object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <OrientationLock />

      {/* =========================
         HEADER
      ========================= */}
      <header className="absolute top-0 left-0 right-0 bg-black text-white p-4 z-50">
        <div className="flex justify-between items-center">
          <button onClick={() => handleSectionChange(Section.INTRO)}>
            <AssetImage src="/jakegalm.jpg" fallback="Jake Galm" className="h-6" />
          </button>

          <div className="flex gap-6">
            <button onClick={() => handleSectionChange(Section.WORK)}>
              <AssetImage src="/work.jpg" fallback="Work" className="h-6" />
            </button>
            <button onClick={() => handleSectionChange(Section.ABOUT)}>
              <AssetImage src="/about.jpg" fallback="About" className="h-6" />
            </button>
            <button onClick={() => handleSectionChange(Section.SUPPORT)}>
              <AssetImage src="/support.jpg" fallback="Support" className="h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================
         MAIN CONTENT
      ========================= */}
      <main className="flex-grow pt-20">
        {section !== Section.INTRO && (
          <iframe
            src={getSubsectionFile()!}
            className="w-full h-full border-none"
          />
        )}
      </main>
    </div>
  );
}
