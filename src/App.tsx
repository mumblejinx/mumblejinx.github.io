/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react'; // ✅ added useRef
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

  const touchStartX = useRef(0); // ✅ NEW

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
        setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
      } else if (e.key === 'ArrowLeft') {
        setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
      } else if (e.key === 'Escape') {
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">

      {/* Global Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            // ✅ NEW SWIPE HANDLERS (SAFE)
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const endX = e.changedTouches[0].clientX;
              const diff = touchStartX.current - endX;

              if (Math.abs(diff) > 50 && lightbox) {
                if (diff > 0) {
                  // NEXT
                  setLightbox(prev =>
                    prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
                  );
                } else {
                  // PREV
                  setLightbox(prev =>
                    prev ? {
                      ...prev,
                      index: (prev.index - 1 + prev.images.length) % prev.images.length
                    } : null
                  );
                }
              }
            }}

            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white hover:text-[#8bc34a] transition-colors z-[110]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Navigation Buttons */}
            <button 
              onClick={() => setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-[#8bc34a] transition-colors z-[110] p-2 bg-black/50 rounded-full"
            >
              ←
            </button>

            <button 
              onClick={() => setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-[#8bc34a] transition-colors z-[110] p-2 bg-black/50 rounded-full"
            >
              →
            </button>

            {/* Content */}
            <div className="flex flex-col md:flex-row w-fit max-w-[95vw] max-h-full gap-8 items-center md:items-start overflow-y-auto md:overflow-visible relative">
              <div className="relative flex flex-col items-center justify-center">
                <motion.img 
                  key={lightbox.images[lightbox.index].full}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={lightbox.images[lightbox.index].full} 
                  className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain shadow-2xl"
                />

                <div className="mt-4 text-gray-500 text-sm font-mono tracking-widest">
                  {lightbox.index + 1} / {lightbox.images.length}
                </div>
              </div>

              <div className="w-full md:w-72">
                <h2 className="text-[#8bc34a] text-lg font-bold mb-3 uppercase tracking-widest">
                  Description
                </h2>
                <div className="text-gray-300 text-sm leading-relaxed">
                  {lightbox.images[lightbox.index].description || "No description available."}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <OrientationLock />

      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 bg-black text-white p-4 z-50 h-auto md:h-20 flex items-center">
        <div className="w-full flex justify-between items-center md:justify-center md:relative">
          <button onClick={() => handleSectionChange(Section.INTRO)}>
            <AssetImage src="/jakegalm.jpg" fallback="Jake Galm" className="h-5 md:h-8" />
          </button>
        </div>
      </header>

      {/* MAIN */}
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
