import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Home, Package, MapPin, MessageCircle, ShoppingCart } from "lucide-react";

interface NavbarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export default function Navbar({ currentView, onChangeView }: NavbarProps) {
  const { t } = useTranslation();

  const navItems = [
    { id: "home", label: t("home"), icon: Home },
    { id: "products", label: t("products"), icon: Package },
    { id: "shop", label: t("shop"), icon: ShoppingCart },
    { id: "branches", label: t("branches"), icon: MapPin },
    { id: "inquiry", label: t("inquiry"), icon: MessageCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade to transparent at bottom to blend with safe area */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-zinc-950 via-white/90 dark:via-zinc-950/90 to-transparent pointer-events-none transition-colors duration-500" />

      <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-white/20 dark:border-zinc-800/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)] pb-safe transition-colors duration-500">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 group",
                  isActive ? "text-tiens-primary dark:text-tiens-primary-light" : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                )}
              >
                <div className={cn(
                  "relative p-2.5 rounded-2xl transition-all duration-300",
                  isActive ? "bg-tiens-primary/10 dark:bg-tiens-primary-light/10 -translate-y-1" : "group-hover:bg-gray-50 dark:group-hover:bg-zinc-800/50"
                )}>
                  <item.icon className={cn("w-6 h-6 transition-transform duration-300", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold mt-1 transition-all duration-300",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 absolute bottom-2"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
