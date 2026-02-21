import { useTranslation } from "react-i18next";
import { Globe, Menu, Moon, Sun } from "lucide-react";
import TiensLogo from "@/components/TiensLogo";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onMenuClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

export default function Header({ onMenuClick, isDarkMode, toggleDarkMode, toggleLanguage }: HeaderProps) {
  const { i18n } = useTranslation();

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl z-40 border-b border-white/20 dark:border-zinc-800/50 flex items-center justify-between px-4 shadow-sm transition-all duration-500"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 transition-colors active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          {/* هنا تم استخدام اللوجو المبرمج */}
          <TiensLogo className="w-10 h-10" showText={false} />
          <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight mt-1 transition-colors duration-500">TIENS</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="relative p-2 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all active:scale-95 overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDarkMode ? "dark" : "light"}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.div>
          </AnimatePresence>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Globe className="w-4 h-4 text-tiens-primary dark:text-tiens-primary-light" />
          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide transition-colors duration-500">{i18n.language}</span>
        </button>
      </div>
    </header>
  );
}