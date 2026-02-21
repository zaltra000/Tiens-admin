import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { X, Home, Package, MapPin, MessageCircle, Globe, Facebook, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import TiensLogo from "@/components/TiensLogo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export default function Sidebar({ isOpen, onClose, currentView, onChangeView }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const menuItems = [
    { id: "home", label: t("home"), icon: Home },
    { id: "products", label: t("products"), icon: Package },
    { id: "shop", label: t("shop"), icon: ShoppingCart },
    { id: "branches", label: t("branches"), icon: MapPin },
    { id: "inquiry", label: t("inquiry"), icon: MessageCircle },
  ];

  const sidebarVariants = {
    closed: {
      x: isRTL ? "100%" : "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { x: isRTL ? 20 : -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const handleItemClick = (id: string) => {
    onChangeView(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60]"
          />

          {/* Sidebar Panel */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              "fixed top-0 bottom-0 w-[300px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl z-[70] shadow-2xl flex flex-col transition-colors duration-500",
              isRTL ? "right-0 rounded-l-[2.5rem]" : "left-0 rounded-r-[2.5rem]"
            )}
          >
            {/* Header */}
            <div className="p-8 pb-6 flex items-center justify-between">
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="bg-white dark:bg-zinc-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                  <TiensLogo className="w-10 h-10" showText={false} />
                </div>
                <div>
                  <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white leading-none tracking-tight transition-colors duration-500">TIENS</h2>
                  <p className="text-[10px] text-tiens-primary dark:text-tiens-primary-light font-bold mt-1 tracking-widest uppercase transition-colors duration-500">Sudan Branch</p>
                </div>
              </motion.div>
              <motion.button
                variants={itemVariants}
                onClick={onClose}
                className="p-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-gray-500 dark:text-zinc-400 active:scale-95"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4 px-6 space-y-3 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <motion.button
                    variants={itemVariants}
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-tiens-primary to-tiens-primary-dark dark:from-tiens-primary-light dark:to-tiens-primary text-white shadow-lg shadow-tiens-primary/30 dark:shadow-tiens-primary-light/20"
                        : "bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-600 dark:text-zinc-400 border border-transparent hover:border-gray-100 dark:hover:border-zinc-700"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-full",
                          isRTL ? "right-0" : "left-0"
                        )}
                      />
                    )}
                    <item.icon className={cn(
                      "w-5 h-5 relative z-10 transition-colors duration-300",
                      isActive ? "text-white" : "text-gray-400 dark:text-zinc-500 group-hover:text-tiens-primary dark:group-hover:text-tiens-primary-light"
                    )} />
                    <span className="font-bold text-sm relative z-10">{item.label}</span>

                    <ChevronRight className={cn(
                      "w-4 h-4 absolute transition-all duration-300 z-10",
                      isRTL ? "left-4" : "right-4",
                      isActive ? "text-white/80 opacity-100" : "text-gray-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1",
                      isRTL && "rotate-180 group-hover:-translate-x-1"
                    )} />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="p-8 pt-6">
              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 transition-colors duration-500">
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 text-center transition-colors duration-500">Connect With Us</p>
                <div className="flex gap-3 justify-center">
                  <a href="https://www.tiens.com" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-full hover:border-tiens-primary/50 hover:shadow-md transition-all group active:scale-95">
                    <Globe className="w-4 h-4 text-gray-500 dark:text-zinc-400 group-hover:text-tiens-primary dark:group-hover:text-tiens-primary-light transition-colors" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-full hover:border-blue-500/50 hover:shadow-md transition-all group active:scale-95">
                    <Facebook className="w-4 h-4 text-gray-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </a>
                  <a href={`https://wa.me/249126284069`} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-full hover:border-green-500/50 hover:shadow-md transition-all group active:scale-95">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-500 dark:fill-zinc-400 group-hover:fill-[#25D366] transition-colors" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.015-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}