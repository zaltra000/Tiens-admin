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
import { Globe } from "lucide-react";
import "@/i18n";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [targetLang, setTargetLang] = useState("");
  const { i18n } = useTranslation();

  // Hide StatusBar on native mobile
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide().catch(console.error);
    }
  }, []);

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

    // Wait for the overlay to slide up
    await new Promise(resolve => setTimeout(resolve, 400));

    await i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // Wait a moment so the user sees the loading state briefly
    await new Promise(resolve => setTimeout(resolve, 400));

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

      <AnimatePresence>
        {isChangingLanguage && (
          <motion.div
            initial={{ y: "100%", borderTopLeftRadius: "100%", borderTopRightRadius: "100%" }}
            animate={{ y: 0, borderTopLeftRadius: "0%", borderTopRightRadius: "0%" }}
            exit={{ y: "-100%", borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-tiens-primary dark:bg-tiens-primary-dark flex items-center justify-center shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-white flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Globe className="w-16 h-16 mb-6 opacity-90" />
              </motion.div>
              <h2 className="text-3xl font-bold font-cairo tracking-wide">
                {targetLang === 'en' ? 'Switching to English...' : 'جاري التبديل للعربية...'}
              </h2>
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
