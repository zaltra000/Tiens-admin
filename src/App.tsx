import React, { useState, useEffect, useMemo } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from './firebase';
import { InventoryData, PricesData, ProductsData, Product, OrdersData } from './types';
import { DollarSign, ShoppingBag, Plus, Search, ChevronLeft, Loader2, Package, Activity, Sparkles, HeartPulse, AlertCircle } from 'lucide-react';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'prices' | 'orders';
type Category = 'all' | 'supplements' | 'cosmetics' | 'devices';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('prices');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [prices, setPrices] = useState<PricesData | null>(null);
  const [products, setProducts] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrdersData | null>(null);

  // Lock scroll for Add Product modal
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showAddModal]);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => {
      console.error("Authentication failed:", err);
      setError(`خطأ في المصادقة: ${err.message}`);
    });

    const inventoryRef = ref(db, 'inventory');
    const pricesRef = ref(db, 'prices');
    const productsRef = ref(db, 'products');
    const ordersRef = ref(db, 'orders');

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 4) setLoading(false);
    };

    const unsubInventory = onValue(inventoryRef, (snapshot) => {
      setInventory(snapshot.val() || {});
      checkLoaded();
    }, (err) => {
      setError(err.message);
      checkLoaded();
    });

    const unsubPrices = onValue(pricesRef, (snapshot) => {
      setPrices(snapshot.val() || {});
      checkLoaded();
    }, (err) => {
      setError(err.message);
      checkLoaded();
    });

    const unsubOrders = onValue(ordersRef, (snapshot) => {
      const val = snapshot.val() || {};
      const mappedOrders: OrdersData = {};
      Object.entries(val).forEach(([id, order]: [string, any]) => {
        mappedOrders[id] = { ...order, id };
      });
      setOrders(mappedOrders);
      checkLoaded();
    }, (err) => {
      setError(err.message);
      checkLoaded();
    });

    const unsubProducts = onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val && (val.ar || val.en)) {
        console.log("Detected old data format, migrating...");
        const newProducts: Record<string, any> = {};
        const arProducts = val.ar || {};
        const enProducts = val.en || {};
        const allIds = new Set([...Object.keys(arProducts), ...Object.keys(enProducts)]);

        allIds.forEach(id => {
          const arItem = arProducts[id] || {};
          const enItem = enProducts[id] || {};
          newProducts[id] = {
            id: id,
            price: arItem.price || enItem.price || 0,
            currency: arItem.currency || enItem.currency || 'SDG',
            category: arItem.category || enItem.category || '',
            element: arItem.element || enItem.element || '',
            image: arItem.image || enItem.image || '',
            inStock: arItem.inStock ?? enItem.inStock ?? true,
            ar: { name: arItem.name || '', description: arItem.description || '', benefits: arItem.benefits || [] },
            en: { name: enItem.name || '', description: enItem.description || '', benefits: enItem.benefits || [] }
          };
        });
        set(productsRef, newProducts).then(() => console.log("Migration successful")).catch(err => console.error("Migration failed", err));
      } else {
        setProducts(val || {});
      }
      checkLoaded();
    }, (err) => {
      setError(err.message);
      checkLoaded();
    });

    return () => {
      unsubInventory();
      unsubPrices();
      unsubOrders();
      unsubProducts();
    };
  }, []);

  const handleUpdateProduct = async (id: string, product: any) => {
    try {
      await set(ref(db, `products/${id}`), product);
    } catch (err: any) {
      setError(`فشل التحديث: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await set(ref(db, `products/${id}`), null);
    } catch (err: any) {
      setError(`فشل الحذف: ${err.message}`);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return {};
    return Object.fromEntries(
      Object.entries(products).filter(([_, p]: [string, Product]) => {
        const name = p.ar?.name || p.en?.name || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = activeCategory === 'all' || p.category === activeCategory;
        return matchesSearch && categoryMatch;
      })
    );
  }, [products, searchQuery, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]" dir="rtl">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }} 
          transition={{ 
            rotate: { repeat: Infinity, duration: 1, ease: "linear" },
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
        >
          <Loader2 className="w-12 h-12 text-[#d4af37]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4 text-center" dir="rtl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-10 rounded-[3rem] border-red-100 shadow-2xl max-w-md"
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto text-red-500 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">النظام غير متصل</h2>
          <p className="text-slate-500 font-bold leading-relaxed">{error}</p>
        </motion.div>
      </div>
    );
  }

  const totalProducts = products ? Object.keys(products).length : 0;

  const categories = [
    { id: 'all', label: 'الكل', icon: Package },
    { id: 'supplements', label: 'المكملات', icon: HeartPulse },
    { id: 'cosmetics', label: 'التجميل', icon: Sparkles },
    { id: 'devices', label: 'أجهزة صحية', icon: Activity },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-40 font-sans relative overflow-x-hidden selection:bg-[#d4af37]/30" dir="rtl">
      {/* Ambient Background Blobs */}
      <div className="bg-blob top-[-10%] left-[-10%] bg-[#064e3b]"></div>
      <div className="bg-blob bottom-[-10%] right-[-10%] bg-[#d4af37]"></div>

      {/* Header Section */}
      <header className="sticky top-0 z-[100] p-4 lg:p-6">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="glass-dark rounded-[2.5rem] p-6 shadow-premium relative overflow-hidden ring-1 ring-white/10"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/15 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group"
              >
                <Package className="w-7 h-7 text-[#d4af37] group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white leading-none mb-1">تيانزي <span className="text-[#d4af37]">الآدمن</span></h1>
                <p className="text-[10px] text-emerald-200/50 font-black uppercase tracking-[0.2em]">نظام التحكم المركزي</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto">
              <div className="glass px-6 py-3 rounded-2xl border-white/10 bg-white/5 flex items-center gap-4">
                <Activity className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <p className="text-[9px] text-white/40 font-black uppercase tracking-wider">حالة النظام</p>
                  <p className="text-xs font-black text-emerald-400">متصل</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center group ring-1 ring-white/5 hover:bg-white/10 transition-colors">
              <p className="text-[9px] text-emerald-100/40 font-black mb-1 uppercase tracking-widest group-hover:text-emerald-100 transition-colors">إجمالي المنتجات</p>
              <p className="text-2xl font-black text-white lining-nums">{totalProducts}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center group ring-1 ring-white/5 hover:bg-white/10 transition-colors">
              <p className="text-[9px] text-emerald-100/40 font-black mb-1 uppercase tracking-widest group-hover:text-emerald-100 transition-colors">تحديثات اليوم</p>
              <p className="text-2xl font-black text-[#d4af37] lining-nums">12</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Search and Filter Section */}
      <div className="px-6 relative z-50 mb-10 -mt-2 space-y-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", damping: 25 }}
          className="glass rounded-3xl shadow-premium border-white p-2.5 flex items-center gap-4 group focus-within:ring-2 ring-[#d4af37]/30 transition-all"
        >
          <div className="w-14 h-14 premium-gradient shadow-lg rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
            <Search className="w-6 h-6 text-white" />
          </div>
          <input 
            type="text" 
            placeholder="ابحث عن المنتجات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-base font-black text-slate-800 placeholder:text-slate-400 placeholder:font-bold py-2"
          />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 25 }}
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button 
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`flex-none flex items-center gap-3 px-7 py-4 rounded-[1.5rem] text-sm font-black transition-all duration-500 border ${
                  isActive 
                    ? 'premium-gradient text-white border-transparent shadow-xl shadow-pine-900/10 scale-105' 
                    : 'glass text-slate-500 border-white/60 hover:bg-white hover:text-pine-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                </div>
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Main Content Area */}
      <main className="px-6 max-w-5xl mx-auto min-h-[60vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'prices' ? (
            <motion.div
              key="prices"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductsTab 
                data={filteredProducts} 
                onUpdate={(id, product) => handleUpdateProduct(id, product)}
                onDelete={(id) => handleDeleteProduct(id)}
                isAddModalOpen={showAddModal}
                closeAddModal={() => setShowAddModal(false)}
              />
            </motion.div>
            ) : (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                <OrdersTab orders={orders} />
              </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-0 right-0 z-[200] flex justify-center px-6">
        <motion.div 
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.6 }}
          className="glass-nav rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl relative w-[320px] max-w-full"
        >
          {/* Prices/Assets Tab */}
          <button 
            onClick={() => setActiveTab('prices')}
            className={`flex-1 relative z-10 py-3 flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'prices' ? 'text-white' : 'text-slate-400'}`}
          >
            {activeTab === 'prices' && (
              <motion.div 
                layoutId="navTab"
                className="absolute inset-0 premium-gradient rounded-2xl shadow-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <DollarSign className={`w-6 h-6 ${activeTab === 'prices' ? 'opacity-100' : 'opacity-60'}`} />
            <span className="text-[9px] font-black uppercase tracking-wider">الأصول</span>
          </button>

          {/* Plus Add Button (Center) */}
          <div className="relative z-20 px-4">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddModal(true)}
              className="w-14 h-14 premium-gradient text-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white transform -translate-y-2"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          </div>

          {/* Orders Tab */}
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 relative z-10 py-3 flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'orders' ? 'text-white' : 'text-slate-400'}`}
          >
            {activeTab === 'orders' && (
              <motion.div 
                layoutId="navTab"
                className="absolute inset-0 premium-gradient rounded-2xl shadow-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ShoppingBag className={`w-6 h-6 ${activeTab === 'orders' ? 'opacity-100' : 'opacity-60'}`} />
            <span className="text-[9px] font-black uppercase tracking-wider">الطلبات</span>
          </button>
        </motion.div>
      </nav>
    </div>
  );
}
