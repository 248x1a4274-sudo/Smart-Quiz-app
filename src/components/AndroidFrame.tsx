import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, Moon, Sun, Wifi, BatteryMedium } from 'lucide-react';
import { soundService } from '../services/audio';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeScreenTitle: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeScreenTitle,
}) => {
  const [isDeviceFrameMode, setIsDeviceFrameMode] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    // Check initial dark mode from DOM
    const hasDark = document.documentElement.classList.contains('dark');
    setIsDark(hasDark);
    setSoundEnabled(soundService.isEnabled());

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    soundService.playTap();
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setEnabled(next);
    if (next) soundService.playTap();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Application Bar adhering to Top Bar Contract */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              SQ
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Smart Quiz
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation / Context state indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Material Design 3</span>
            <span aria-hidden="true">·</span>
            <span>Android / Flutter 3.35</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeScreenTitle}</span>
          </div>

          {/* Zone 3: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Device frame switch */}
            <button
              onClick={() => {
                soundService.playTap();
                setIsDeviceFrameMode(!isDeviceFrameMode);
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isDeviceFrameMode ? 'Switch to Fullscreen Responsive' : 'Switch to Android Phone Frame'}
            >
              {isDeviceFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 w-full">
        {isDeviceFrameMode ? (
          /* Realistic Android Phone Device Shell */
          <div className="w-full max-w-[430px] mx-auto my-auto transition-all">
            <div className="relative rounded-[44px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800 shadow-slate-900/40">
              {/* Outer chassis highlights */}
              <div className="relative rounded-[36px] bg-white dark:bg-slate-950 overflow-hidden flex flex-col h-[740px] border border-slate-200 dark:border-slate-800 shadow-inner">
                {/* Android Status Bar */}
                <div className="h-10 px-6 pt-1 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 select-none bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs z-30">
                  <span className="font-mono text-xs tabular-nums tracking-tight">
                    {currentTime}
                  </span>
                  {/* Camera Punchhole */}
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-950 dark:bg-slate-900 ring-2 ring-slate-800/20" />
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] font-bold">5G</span>
                    <Wifi className="w-3.5 h-3.5" />
                    <BatteryMedium className="w-4 h-4" />
                  </div>
                </div>

                {/* Scrollable Screen Content */}
                <div className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
                  {children}
                </div>

                {/* Android Gesture Bar */}
                <div className="h-4 flex items-center justify-center shrink-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xs">
                  <div className="w-28 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive Viewport Mode */
          <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 shadow-sm my-auto">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
