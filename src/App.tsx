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
  const [lightbox, setLightbox] = useState<{ images: any[], index: number } | null>(null);

  // ✅ NEW: track when image is loaded
  const [imgLoaded, setImgLoaded] = useState(false);

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

  // ✅ Reset fade when image changes
  useEffect(() => {
    if (lightbox) {
      setImgLoaded(false);
    }
  }, [lightbox?.index]);

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

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >

            {/* CLOSE */}
            <button 
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white z-[110]"
            >
              ✕
            </button>

            {/* PREV */}
            <button 
              onClick={() => setLightbox(prev => prev ? {
                ...prev,
                index: (prev.index - 1 + prev.images.length) % prev.images.length
              } : null)}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white z-[110]"
            >
              ←
            </button>

            {/* NEXT */}
            <button 
              onClick={() => setLightbox(prev => prev ? {
                ...prev,
                index: (prev.index + 1) % prev.images.length
              } : null)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white z-[110]"
            >
              →
            </button>

            {/* IMAGE */}
            <motion.img 
              key={lightbox.images[lightbox.index].full}
              src={lightbox.images[lightbox.index].full}
              onLoad={() => setImgLoaded(true)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: imgLoaded ? 1 : 0,
                scale: imgLoaded ? 1 : 0.95
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <OrientationLock />

      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 bg-black text-white p-4 z-50">
        <button onClick={() => handleSectionChange(Section.INTRO)}>
          <AssetImage src="/jakegalm.jpg" fallback="Jake Galm" />
        </button>
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
