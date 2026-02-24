/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import HomeView from "@/views/HomeView";
import BranchesView from "@/views/BranchesView";
import ProductsView from "@/views/ProductsView";
import ShopView from "@/views/ShopView";
import InquiryView from "@/views/InquiryView";
import SplashScreen from "@/components/SplashScreen";
import UpdateScreen from "@/components/UpdateScreen";
import { Globe } from "lucide-react";
import "@/i18n";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { checkForUpdate, type AppUpdateInfo } from '@/lib/firebase';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [targetLang, setTargetLang] = useState("");
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const { i18n } = useTranslation();

  // Hide StatusBar on native mobile
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide().catch(console.error);
    }
  }, []);

  // Check for app updates after splash screen
  useEffect(() => {
    if (!showSplash) {
      checkForUpdate().then(info => {
        if (info) {
          setUpdateInfo(info);
        }
      });
    }
  }, [showSplash]);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(savedMode === "true");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  // Set initial direction
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleLanguage = async () => {
    if (isChangingLanguage) return;

    const newLang = i18n.language === "ar" ? "en" : "ar";
    setTargetLang(newLang);
    setIsChangingLanguage(true);

    // ننتظر قليلاً لكي يستمتع المستخدم برؤية الأنيميشن الجديد
    await new Promise(resolve => setTimeout(resolve, 600));

    await i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // ننتظر قليلاً قبل إخفاء الشاشة
    await new Promise(resolve => setTimeout(resolve, 600));

    setIsChangingLanguage(false);
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onChangeView={setCurrentView} />;
      case "products":
        return <ProductsView key="products" />;
      case "shop":
        return <ShopView key="shop" />;
      case "branches":
        return <BranchesView key="branches" />;
      case "inquiry":
        return <InquiryView key="inquiry" />;
      default:
        return <HomeView onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className={`min-h-screen bg-bg-soft dark:bg-zinc-950 font-sans ${i18n.language === 'ar' ? 'font-cairo' : 'font-sans'} text-gray-800 dark:text-zinc-100 selection:bg-tiens-primary/20 transition-colors duration-500`}>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {updateInfo && <UpdateScreen updateInfo={updateInfo} onDismiss={() => setUpdateInfo(null)} />}

      <AnimatePresence>
        {isChangingLanguage && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-black/40 dark:bg-black/70 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-[18rem] bg-white dark:bg-zinc-900 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl overflow-hidden"
            >
              {/* إضاءات خلفية جمالية */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-tiens-primary/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -ml-16 -mb-16" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="relative w-20 h-20 mb-5 flex items-center justify-center rounded-3xl bg-gradient-to-br from-tiens-primary/15 to-emerald-100 dark:from-tiens-primary/20 dark:to-emerald-900/30 border border-white/50 dark:border-white/5 shadow-inner"
              >
                <Globe className="w-10 h-10 text-tiens-primary dark:text-tiens-primary-light" />
              </motion.div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center font-cairo mb-3">
                {targetLang === 'en' ? 'Changing Language' : 'جاري تغيير اللغة'}
              </h2>
              
              {/* نقاط تحميل متحركة */}
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex gap-2 items-center"
              >
                <div className="w-2 h-2 rounded-full bg-tiens-primary" />
                <div className="w-2 h-2 rounded-full bg-tiens-accent" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        toggleLanguage={toggleLanguage}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      <main className="min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentView}-${i18n.language}`}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <Navbar currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
}
