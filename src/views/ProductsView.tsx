import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { tiensData } from "@/data/tiensData";
import { Leaf, Sparkles, Heart, Home, ChevronRight, Globe, MapPin, Info, CheckCircle, X, Beaker, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

// Define an extended type for our Products to quiet down TypeScript warnings.
export interface Product {
  name: string;
  subtitle?: string;
  desc: string;
  fullDescription?: string;
  ingredients?: string;
  recommendedPortion?: string;
  netContent?: string;
  disclaimer?: string;
  available: boolean;
  inStock?: boolean;
  image?: string;
}

export default function ProductsView() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const products = tiensData[lang].products;
  const isRTL = lang === "ar";

  const [market, setMarket] = useState<"sudan" | "global">("sudan");

  const categories = [
    { id: "healthFood", label: t("healthFood"), icon: Leaf, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { id: "beautySkinCare", label: t("beautySkinCare"), icon: Sparkles, color: "text-pink-500 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { id: "personalCare", label: t("personalCare"), icon: Heart, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { id: "householdItems", label: t("householdItems"), icon: Home, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ] as const;

  const [activeCategory, setActiveCategory] = useState<keyof typeof products>("healthFood");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);
  // Filter products based on market selection
  const filteredProducts = products[activeCategory].filter(p =>
    market === "sudan" ? p.available : !p.available
  );

  // Calculate counts for badges
  const getCount = (m: "sudan" | "global") => {
    return products[activeCategory].filter(p => m === "sudan" ? p.available : !p.available).length;
  };

  const hasItems = filteredProducts.length > 0;

  return (
    <div className="pb-24 pt-20 px-4 h-full flex flex-col max-w-lg mx-auto">
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">{t("products")}</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed transition-colors duration-500">
          {lang === 'ar'
            ? "توفر شركة تينز مجموعة واسعة من المنتجات الصحية والمكملات الغذائية ومنتجات العناية الشخصية. جميع المنتجات مسجلة في وزارة الصحة السودانية وحاصلة على شهادات جودة عالمية."
            : "Tiens offers a wide range of health products, nutritional supplements, and personal care products. All products are registered with the Sudanese Ministry of Health and hold global quality certifications."}
        </p>
      </div>

      {/* Market Toggle */}
      <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-2xl flex mb-6 relative shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-500">
        <div
          className={cn(
            "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-tiens-primary/10 dark:bg-tiens-primary-light/10 rounded-xl transition-all duration-300 ease-out",
            market === "sudan" ? (isRTL ? "right-1.5" : "left-1.5") : (isRTL ? "right-[calc(50%)]" : "left-[calc(50%)]")
          )}
        />
        <button
          onClick={() => setMarket("sudan")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl relative z-10 transition-colors",
            market === "sudan" ? "text-tiens-primary dark:text-tiens-primary-light" : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
          )}
        >
          <MapPin className="w-4 h-4" />
          {t("sudanProducts")}
          <span className="bg-white/50 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded-md text-[10px] ml-1">
            {getCount("sudan")}
          </span>
        </button>
        <button
          onClick={() => setMarket("global")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl relative z-10 transition-colors",
            market === "global" ? "text-tiens-primary dark:text-tiens-primary-light" : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
          )}
        >
          <Globe className="w-4 h-4" />
          {t("globalProducts")}
          <span className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[10px] ml-1">
            {getCount("global")}
          </span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap border",
                isActive
                  ? "bg-tiens-primary dark:bg-tiens-primary-light text-white dark:text-zinc-900 border-tiens-primary dark:border-tiens-primary-light shadow-lg shadow-tiens-primary/20 dark:shadow-tiens-primary-light/20"
                  : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              )}
            >
              <cat.icon className={cn("w-4 h-4", isActive ? "text-white dark:text-zinc-900" : cat.color)} />
              <span className="text-sm font-semibold">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <AnimatePresence mode="wait">
          {hasItems ? (
            <motion.div
              key={`${activeCategory}-${market}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex gap-5 items-center hover:shadow-md transition-all duration-500 cursor-pointer relative overflow-hidden"
                >
                  {/* Unavailable Badge for Global Products */}
                  {!product.available && (
                    <div className="absolute top-0 right-0 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] px-3 py-1 rounded-bl-xl font-bold rtl:right-auto rtl:left-0 rtl:rounded-bl-none rtl:rounded-br-xl flex items-center gap-1 transition-colors duration-500">
                      <Globe className="w-3 h-3" />
                      Global
                    </div>
                  )}

                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 p-2",
                    categories.find(c => c.id === activeCategory)?.bg
                  )}>
                    <img
                      src={(product as any).image}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">📦</span>';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5 truncate transition-colors duration-500">{product.name}</h3>
                    <p className="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 transition-colors duration-500">{product.desc}</p>
                    {!product.available && (
                      <p className="text-orange-500 dark:text-orange-400 text-[10px] mt-2 font-medium flex items-center gap-1 transition-colors duration-500">
                        <Info className="w-3 h-3" />
                        {t("notAvailable")}
                      </p>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-300 dark:text-zinc-600 group-hover:bg-tiens-primary dark:group-hover:bg-tiens-primary-light group-hover:text-white dark:group-hover:text-zinc-900 transition-colors">
                    <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 transition-colors duration-500"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-500">
                <Info className="w-6 h-6 text-gray-300 dark:text-zinc-600" />
              </div>
              <p className="text-sm font-medium">
                {market === 'global'
                  ? (lang === 'ar' ? "لا توجد منتجات عالمية غير متوفرة في هذا القسم" : "No global-only products in this category")
                  : (lang === 'ar' ? "لا توجد منتجات متوفرة حالياً" : "No products available currently")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 text-xs leading-relaxed space-y-2 transition-colors duration-500">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            {lang === 'ar'
              ? "جميع منتجات شركة تينز مسجلة في وزارة الصحة السودانية وحاصلة على شهادات جودة عالمية (ISO, FDA, HACCP, GMP)."
              : "All Tiens products are registered with the Sudan Ministry of Health and hold global quality certificates (ISO, FDA, HACCP, GMP)."}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            {lang === 'ar'
              ? "ينصح بالحصول على المنتجات من الفروع الرسمية أو الموزعين المعتمدين لضمان الجودة."
              : "It is recommended to obtain products from official branches or authorized distributors to ensure quality."}
          </p>
        </div>
      </div>

      {/* Modern Animated Product Modal via React Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedProduct && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md z-[100] transition-colors duration-500"
              />

              {/* Modal Content */}
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {/* Header Image Area */}
                  <div className={cn(
                    "relative w-full h-48 sm:h-56 p-6 flex flex-col justify-between overflow-hidden",
                    categories.find(c => c.id === activeCategory)?.bg
                  )}>
                    {/* Decorative faint icon */}
                    {categories.find(c => c.id === activeCategory)?.icon && (
                      <div className="absolute -right-8 -bottom-8 opacity-[0.05] dark:opacity-10 pointer-events-none">
                        {(() => {
                          const Icon = categories.find(c => c.id === activeCategory)!.icon;
                          return <Icon className="w-64 h-64" />;
                        })()}
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 w-10 h-10 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all shadow-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {!selectedProduct.available && (
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                        <Globe className="w-3.5 h-3.5" />
                        {t("notAvailable")}
                      </div>
                    )}

                    <div className="relative z-0 h-full w-full flex items-center justify-center">
                      <motion.img
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="max-h-full max-w-full object-contain drop-shadow-xl"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl">📦</span>';
                        }}
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-zinc-900 transition-colors duration-500">
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">{selectedProduct.name}</h2>
                      {selectedProduct.subtitle && (
                        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                          {selectedProduct.subtitle}
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                        {selectedProduct.fullDescription || selectedProduct.desc}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-4 mb-6">
                      {selectedProduct.ingredients && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl flex gap-3 transition-colors duration-500">
                          <div className="mt-0.5 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                            <Leaf className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                              {lang === 'ar' ? "المكونات الرئيسية" : "Main Ingredients"}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                              {selectedProduct.ingredients}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedProduct.recommendedPortion && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl flex gap-3 transition-colors duration-500">
                          <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                            <Beaker className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                              {lang === 'ar' ? "الجرعة الموصى بها" : "Recommended Portion"}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                              {selectedProduct.recommendedPortion}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedProduct.netContent && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl flex gap-3 transition-colors duration-500">
                          <div className="mt-0.5 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                            <Archive className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                              {lang === 'ar' ? "المحتوى الصافي" : "Net Content"}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                              {selectedProduct.netContent}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Disclaimer */}
                  {(selectedProduct.disclaimer || selectedProduct.available) && (
                    <div className="p-5 bg-gray-50/80 dark:bg-zinc-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-zinc-800 transition-colors duration-500 shrink-0">
                      {selectedProduct.disclaimer && (
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 italic flex gap-2">
                          <Info className="w-4 h-4 flex-shrink-0" />
                          <span>{selectedProduct.disclaimer}</span>
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
