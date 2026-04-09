/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, WorkSubsection, AboutSubsection, Subsection } from './constants';
import { AssetImage } from './components/AssetImage';

/**
 * JAKE GALM PORTFOLIO
 * 
 * ASSET REPLACEMENT GUIDE:
 * To replace text fallbacks with real images, place the following files in the 'public/' folder:
 * - /jakegalm.jpg (Logo)
 * - /work.jpg, /about.jpg, /support.jpg (Top Menu)
 * - /computer_intro.jpg, /phone_intro.jpg (Intro Images)
 * - /drip-one.png, /drip-two.png, /drip-three.png (Drips)
 * - /analog.jpg, /digital.jpg, /mixed.jpg (Work Subsections)
 * - /word.jpg, /rundown.jpg, /contact.jpg (About Subsections)
 */

export default function App() {
  const [section, setSection] = useState<Section>(Section.INTRO);
  const [subsection, setSubsection] = useState<Subsection>(null);
  const [animKey, setAnimKey] = useState(0);

  // Reset subsection when section changes
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
      {/* Top Menu Bar */}
      <header className="bg-black text-white p-4 z-50 h-auto md:h-20 flex items-center">
        <div className="w-full flex justify-between items-center md:justify-center md:relative">
          <button 
            onClick={() => handleSectionChange(Section.INTRO)}
            className="hover:opacity-70 transition-opacity md:absolute md:left-8"
          >
            <AssetImage src="/jakegalm.jpg" fallback="Jake Galm" className="h-5 md:h-8" />
          </button>
          <nav className="flex justify-center items-center gap-x-8 flex-grow md:flex-grow-0 md:space-x-12 ml-4 md:ml-0">
            <button onClick={() => handleSectionChange(Section.WORK)} className="hover:opacity-70 transition-opacity flex-shrink">
              <AssetImage src="/work.jpg" fallback="Work" className="h-5 md:h-8" />
            </button>
            <button onClick={() => handleSectionChange(Section.ABOUT)} className="hover:opacity-70 transition-opacity flex-shrink">
              <AssetImage src="/about.jpg" fallback="About" className="h-5 md:h-8" />
            </button>
            <button onClick={() => handleSectionChange(Section.SUPPORT)} className="hover:opacity-70 transition-opacity flex-shrink">
              <AssetImage src="/support.jpg" fallback="Support" className="h-5 md:h-8" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex flex-col relative">
        {/* Layer 1: Intro Background (Static, always at the bottom) */}
        <div className="absolute inset-0 bg-white z-10 flex items-center justify-center p-4">
          <div className="hidden md:block">
            <AssetImage src="/computer_intro.jpg" fallback="[INTRO IMAGE]" className="max-w-full max-h-[70vh]" />
          </div>
          <div className="md:hidden">
            <AssetImage src="/phone_intro.jpg" fallback="[INTRO IMAGE]" className="max-w-full max-h-[70vh]" />
          </div>
        </div>

        {/* Layer 2: Black Content Background (Grows from top down) */}
        <motion.div 
          className="absolute inset-x-0 top-0 bg-black z-20"
          initial={false}
          animate={{ 
            height: section === Section.INTRO ? '0%' : 'calc(100% - 120px)' 
          }}
          transition={{ 
            duration: section === Section.INTRO ? 0 : 1.5, 
            ease: "easeInOut"
          }}
        />

        {/* Layer 3: Drip Bar Container (Moves down, boundary between Black and Intro) */}
        <motion.div 
          className="absolute inset-x-0 z-40"
          initial={false}
          animate={{ 
            top: section === Section.INTRO ? '0%' : 'calc(100% - 120px)' 
          }}
          transition={{ 
            duration: section === Section.INTRO ? 0 : 1.5, 
            ease: "easeInOut" 
          }}
        >
          <div className="relative">
            {/* Two Green Lines - Light on top, Dark on bottom - both 10px */}
            <div className="h-[10px] bg-[#8bc34a] w-full relative z-10"></div>
            <div className="h-[10px] bg-[#2e7d32] w-full relative z-10"></div>
            
            {/* Drips Container - Positioned at the top of the light green bar */}
            <div className="absolute top-0 inset-x-0 h-16 z-20">
              {/* Drip One */}
              <motion.div 
                key={`drip-one-${animKey}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute left-[8%] md:left-[11%] w-12 md:w-auto"
              >
                <AssetImage src="/drip-one.png" fallback="DRIP ONE" textClassName="text-[#8bc34a]" />
              </motion.div>
              
              {/* Drip Two */}
              <motion.div 
                key={`drip-two-${animKey}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
                className="absolute left-[65%] md:left-[80%] w-12 md:w-auto"
              >
                <AssetImage src="/drip-two.png" fallback="DRIP TWO" textClassName="text-[#8bc34a]" />
              </motion.div>
              
              {/* Drip Three */}
              <motion.div 
                key={`drip-three-${animKey}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 2.8, ease: "easeOut", delay: 0.4 }}
                className="absolute left-[82%] md:left-[88%] w-12 md:w-auto"
              >
                <AssetImage src="/drip-three.png" fallback="DRIP THREE" textClassName="text-[#8bc34a]" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Layer 4: Content Layer */}
        <div className="flex-grow flex flex-col relative z-30">
          <main className="flex-grow relative overflow-hidden">
            <AnimatePresence mode="wait">
              {section !== Section.INTRO && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.3,
                    delay: 1.5 // Wait for descent to finish
                  }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="flex-grow p-4 md:p-8">
                    {getSubsectionFile() ? (
                      <iframe
                        src={getSubsectionFile()!}
                        className="w-full h-full border-none"
                        title="Content"
                      />
                    ) : (
                      <div className="w-full h-full bg-black" />
                    )}
                  </div>
                  {/* Space for the drip bar and the white gap below it */}
                  <div className="h-[120px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Bottom Menu Bar - Always visible */}
          <footer className="bg-black p-4 flex flex-wrap justify-center gap-2 md:gap-8 z-50 h-auto min-h-16 md:h-20 items-center border-t border-gray-800">
            <AnimatePresence>
              {section !== Section.INTRO && (
                <motion.div 
                  key="footer-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                  className="flex flex-wrap justify-center gap-2 md:gap-8 w-full"
                >
                  {section === Section.WORK && (
                    <>
                      {Object.values(WorkSubsection).map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleSubsectionChange(sub)}
                          className={`hover:opacity-70 transition-opacity ${subsection === sub ? 'ring-2 ring-[#8bc34a]' : ''}`}
                        >
                          <AssetImage src={`/${sub.toLowerCase()}.jpg`} fallback={sub} className="h-5 md:h-8" />
                        </button>
                      ))}
                    </>
                  )}
                  {section === Section.ABOUT && (
                    <>
                      {Object.values(AboutSubsection).map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleSubsectionChange(sub)}
                          className={`hover:opacity-70 transition-opacity ${subsection === sub ? 'ring-2 ring-[#8bc34a]' : ''}`}
                        >
                          <AssetImage src={`/${sub.toLowerCase()}.jpg`} fallback={sub} className="h-5 md:h-8" />
                        </button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </footer>
        </div>
      </div>
    </div>
  );
}
