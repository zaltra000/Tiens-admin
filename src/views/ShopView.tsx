import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { tiensData } from "@/data/tiensData";
import { subscribeToStockStatus, subscribeToPrices } from "@/lib/firebase";
import { ShoppingCart, Plus, Minus, Trash2, X, AlertCircle, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/views/ProductsView";

interface CartItem {
    product: Product;
    quantity: number;
}

export default function ShopView() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const langData = tiensData[i18n.language as "en" | "ar"] || tiensData.en;

    const shopProducts = useMemo(() => {
        const allProducts = [
            ...langData.products.healthFood,
            ...langData.products.beautySkinCare,
            ...langData.products.personalCare,
            ...langData.products.householdItems,
        ];
        return allProducts.filter(p => p.available);
    }, [langData]);

    const [liveStock, setLiveStock] = useState<Record<string, boolean>>({});
    const [livePrices, setLivePrices] = useState<Record<string, number>>({});
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        // Listen to Firebase Realtime Database for stock updates
        const unsubscribeStock = subscribeToStockStatus((newStockData) => {
            setLiveStock(newStockData);
        });

        // Listen for price updates
        const unsubscribePrices = subscribeToPrices((newPriceData) => {
            setLivePrices(newPriceData);
        });

        return () => {
            unsubscribeStock();
            unsubscribePrices();
        };
    }, []);

    const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const getProductPrice = (product: Product) => {
        const priceKeys = Object.keys(livePrices);
        const matchingKey = priceKeys.find(key => {
            const searchKey = key.toLowerCase().trim();
            const pName = product.name.toLowerCase();
            const pSub = (product.subtitle || "").toLowerCase();
            return pName.includes(searchKey) || pSub.includes(searchKey) || searchKey.includes(pSub);
        });
        return matchingKey ? livePrices[matchingKey] : undefined;
    };

    const cartTotalValue = cart.reduce((sum, item) => {
        const price = getProductPrice(item.product) || 0;
        return sum + (price * item.quantity);
    }, 0);

    const addToCart = (product: Product) => {
        if (product.inStock === false) return;

        setCart(prev => {
            const existing = prev.find(item => item.product.name === product.name);
            if (existing) {
                return prev.map(item =>
                    item.product.name === product.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productName: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.name === productName) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productName: string) => {
        setCart(prev => prev.filter(item => item.product.name !== productName));
    };
    const handleCheckout = (platform: "whatsapp" | "facebook") => {
        if (cart.length === 0) return;

        const newline = platform === "whatsapp" ? '%0A' : '\n';

        const itemsText = cart.map(item => {
            const price = getProductPrice(item.product) || 0;
            const lineTotal = price * item.quantity;
            const priceText = price > 0 ? `(${price.toLocaleString()} ${t("sdg")}) = ${lineTotal.toLocaleString()} ${t("sdg")}` : `(${t("priceNotAvailable")})`;
            return `- ${item.quantity}x ${item.product.name} ${priceText}`;
        }).join(newline);

        const totalValueText = cartTotalValue > 0 ? `${newline}*Total Price / إجمالي السعر:* ${cartTotalValue.toLocaleString()} ${t("sdg")}` : '';
        const text = `*New Order from Tiens Sudan App / طلب جديد من تطبيق تينز بالسودان*${newline}${newline}*Items / المنتجات:*${newline}${itemsText}${newline}${newline}*Total Items / إجمالي عدد المنتجات:* ${cartTotalItems}${totalValueText}`;

        if (platform === "whatsapp") {
            const whatsappNumber = "249126284069";
            const url = `https://wa.me/${whatsappNumber}?text=${text}`;
            window.open(url, '_blank');
        } else {
            navigator.clipboard.writeText(text).catch(() => { });
            alert(i18n.language === 'ar' ? "تم نسخ تفاصيل الطلب! يرجى لصقها في رسالة فيسبوك." : "Order details copied! Please paste them in Facebook Messenger.");
            window.open("https://www.facebook.com/share/1DuXR3qVBi/", "_blank");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="pb-32 pt-20 px-4 h-full flex flex-col max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 px-1 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">{t("shop")}</h2>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm transition-colors duration-500">{t("sudanProducts")}</p>
                </div>
            </div>

            {/* Products Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {shopProducts.map((product, idx) => {
                    // Firebase DB lookup - Robust matching
                    // We check if either the Firebase key is inside the product name or vice versa.
                    // This handles cases where user types "Spirulina" but subtitle is "TIENS Spirulina Capsules"
                    const liveStockKeys = Object.keys(liveStock);
                    const matchingKey = liveStockKeys.find(key => {
                        const searchKey = key.toLowerCase().trim();
                        const pName = product.name.toLowerCase();
                        const pSub = (product.subtitle || "").toLowerCase();

                        return pName.includes(searchKey) || pSub.includes(searchKey) || searchKey.includes(pSub);
                    });

                    const isOutOfStockFirebase = matchingKey ? liveStock[matchingKey] === false : undefined;
                    const isOutOfStockLocal = product.inStock === false;
                    const isOutOfStock = isOutOfStockFirebase !== undefined ? isOutOfStockFirebase : isOutOfStockLocal;

                    const price = getProductPrice(product);

                    const cartItem = cart.find(item => item.product.name === product.name);
                    const cartQuantity = cartItem ? cartItem.quantity : 0;

                    return (
                        <motion.div
                            variants={itemVariants}
                            key={idx}
                            className={cn(
                                "bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden flex flex-col transition-all duration-300 relative group",
                                !isOutOfStock && "hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-1",
                                isOutOfStock && "opacity-75 grayscale-[0.5]"
                            )}
                        >
                            <div className="relative h-48 bg-gray-50 dark:bg-zinc-800/50 p-6 flex items-center justify-center overflow-hidden">
                                <motion.img
                                    initial={false}
                                    animate={{ scale: isOutOfStock ? 1 : 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<span className="text-5xl">📦</span>';
                                    }}
                                />

                                {isOutOfStock && (
                                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                        <div className="bg-red-500/90 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 backdrop-blur-md">
                                            <AlertCircle className="w-4 h-4" />
                                            {t("outOfStock")}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                                    {product.name}
                                </h3>
                                {product.subtitle && (
                                    <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 tracking-wider mb-2">
                                        {product.subtitle}
                                    </p>
                                )}

                                <div className="mb-3">
                                    {price !== undefined && price > 0 ? (
                                        <p className="text-tiens-primary dark:text-tiens-primary-light font-bold text-lg">
                                            {price.toLocaleString()} {t("sdg")}
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 dark:text-zinc-500 text-sm font-medium">
                                            {t("priceNotAvailable")}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-auto pt-2 flex items-center justify-between">
                                    {cartQuantity > 0 ? (
                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-full p-1 border border-gray-100 dark:border-zinc-700 w-full justify-between">
                                            <button
                                                onClick={() => updateQuantity(product.name, -1)}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors"
                                            >
                                                {cartQuantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                            </button>
                                            <span className="font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                                                {cartQuantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product.name, 1)}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center text-tiens-primary dark:text-tiens-primary-light focus:outline-none transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            disabled={isOutOfStock}
                                            onClick={() => addToCart(product)}
                                            className={cn(
                                                "w-full py-3 px-4 rounded-xl font-bold flexitems-center justify-center gap-2 transition-all active:scale-95",
                                                isOutOfStock
                                                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                                                    : "bg-tiens-primary dark:bg-tiens-primary-dark text-white hover:shadow-lg hover:shadow-tiens-primary/20 dark:hover:shadow-tiens-primary-light/20"
                                            )}
                                        >
                                            <ShoppingCart className="w-4 h-4 inline-block rtl:ml-2 ltr:mr-2" />
                                            {t("addToCart")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Floating Cart Button */}
            {createPortal(
                <AnimatePresence>
                    {cartTotalItems > 0 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={cn(
                                "fixed top-[88px] z-[60]",
                                isRTL ? "left-4" : "right-4"
                            )}
                        >
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-3.5 rounded-full shadow-2xl shadow-black/20 dark:shadow-white/10 flex items-center justify-center group hover:scale-105 active:scale-95 transition-all"
                            >
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6" />
                                    <motion.div
                                        key={cartTotalItems}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-tiens-primary dark:bg-tiens-primary-dark text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full border-2 border-zinc-900 dark:border-white"
                                    >
                                        {cartTotalItems}
                                    </motion.div>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Cart Checkout Modal via Portal */}
            {createPortal(
                <AnimatePresence>
                    {isCartOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCartOpen(false)}
                                className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] transition-colors duration-500"
                            />

                            {/* Modal Content */}
                            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
                                <motion.div
                                    initial={{ opacity: 0, y: "100%" }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: "100%" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh] sm:max-h-[80vh]"
                                    dir={isRTL ? "rtl" : "ltr"}
                                >
                                    {/* Header */}
                                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-zinc-900">
                                        <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                                            <ShoppingCart className="w-6 h-6 text-tiens-primary dark:text-tiens-primary-light" />
                                            {t("cart")}
                                        </h3>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-gray-500 dark:text-zinc-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Cart Items List */}
                                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-zinc-900/50">
                                        {cart.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600">
                                                <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                                                <p>{t("emptyCart")}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <AnimatePresence>
                                                    {cart.map((item) => (
                                                        <motion.div
                                                            key={item.product.name}
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9, height: 0 }}
                                                            className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 flex gap-4 items-center"
                                                        >
                                                            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-700 rounded-xl flex items-center justify-center shrink-0">
                                                                <img src={item.product.image} alt={item.product.name} className="max-h-12 object-contain" />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.product.name}</h4>
                                                                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-1">{item.product.subtitle}</p>
                                                                {getProductPrice(item.product) ? (
                                                                    <p className="text-tiens-primary dark:text-tiens-primary-light font-bold text-xs mt-1">
                                                                        {(getProductPrice(item.product)! * item.quantity).toLocaleString()} {t("sdg")}
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 rounded-full p-1 border border-gray-100 dark:border-zinc-700 shrink-0">
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.name, -1)}
                                                                    className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                                </button>
                                                                <span className="font-bold text-sm w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.product.name, 1)}
                                                                    className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-tiens-primary dark:text-tiens-primary-light transition-colors"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>

                                    {/* Checkout Footer */}
                                    {cart.length > 0 && (
                                        <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
                                            {cartTotalValue > 0 && (
                                                <div className="flex justify-between items-center mb-4 px-2">
                                                    <span className="text-gray-500 dark:text-zinc-400 font-bold">{t("totalPrice")}</span>
                                                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                                                        {cartTotalValue.toLocaleString()} <span className="text-tiens-primary dark:text-tiens-primary-light text-lg">{t("sdg")}</span>
                                                    </span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <button
                                                    onClick={() => handleCheckout("facebook")}
                                                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#1877F2]/20 active:scale-95 transition-all text-sm"
                                                >
                                                    <Facebook className="w-5 h-5" />
                                                    {t("checkoutViaFacebook")}
                                                </button>

                                                <button
                                                    onClick={() => handleCheckout("whatsapp")}
                                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all text-sm"
                                                >
                                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.015-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                                    {t("checkoutViaWhatsApp")}
                                                </button>
                                            </div>
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
