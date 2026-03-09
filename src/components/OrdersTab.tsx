import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, Phone, MapPin, ChevronRight, User, Package, Calendar } from 'lucide-react';
import { Order, OrdersData } from '../types';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { cn } from '../utils/cn';

interface OrdersTabProps {
  orders: OrdersData | null;
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedOrderId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrderId]);

  const ordersList = orders 
    ? Object.values(orders)
        .filter(o => o && typeof o === 'object')
        .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
    : [];

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!orderId) return;
    try {
      await set(ref(db, `orders/${orderId}/status`), newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabelAr = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'تم التأكيد';
      case 'shipped': return 'جاري الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'تم الإلغاء';
      default: return 'قيد الانتظار';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const selectedOrder = selectedOrderId ? orders?.[selectedOrderId] : null;

  const formatDate = (timestamp: any) => {
    const date = new Date(Number(timestamp) || Date.now());
    try {
      return date.toLocaleString('ar-SD');
    } catch (e) {
      return date.toDateString();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <AnimatePresence mode="popLayout">
        {ordersList.map((order, index) => {
          if (!order || !order.id) return null;
          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              onClick={() => setSelectedOrderId(order.id)}
              className="glass rounded-[2rem] p-5 shadow-premium border-white/60 hover:shadow-2xl transition-all group cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">#{String(order.id).slice(-6).toUpperCase()}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                  getStatusColor(order.status)
                )}>
                  {getStatusIcon(order.status)}
                  {getStatusLabelAr(order.status)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{order.userName || 'غير معروف'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">{order.userLocation || 'لا يوجد موقع'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#c2a67a]">
                  <span className="text-sm font-black">{order.total || 0} {order.items?.[0]?.currency || 'SDG'}</span>
                  <ChevronRight size={16} className="rotate-180" />
                </div>
              </div>
            </motion.div>
          );
        })}

        {ordersList.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass rounded-[3rem] border-dashed border-2 border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">لا توجد طلبات مكتشفة في الشبكة</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 scroll-lock"
            onClick={() => setSelectedOrderId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-xl rounded-[3rem] border-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="p-8 pb-4 flex items-center justify-between border-b border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-lg">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-pine-900 uppercase tracking-widest">تفاصيل الطلب</h3>
                    <p className="text-xs text-slate-400 font-bold">#{String(selectedOrder.id || '').toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-5 rounded-2xl border-white/40">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">العميل</p>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#c2a67a]" />
                      <span className="text-sm font-black text-slate-800">{selectedOrder.userName || 'غير متوفر'}</span>
                    </div>
                  </div>
                  <div className="glass p-5 rounded-2xl border-white/40">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">الاتصال</p>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-[#c2a67a]" />
                      <span className="text-sm font-black text-slate-800">{selectedOrder.userPhone || 'غير متوفر'}</span>
                    </div>
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border-white/40">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">موقع التوصيل</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#c2a67a]" />
                    <span className="text-sm font-black text-slate-800">{selectedOrder.userLocation || 'غير متوفر'}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">بيان الطلب</h5>
                    <span className="text-[10px] font-black text-[#c2a67a]">{(selectedOrder.items || []).length} أصناف</span>
                  </div>
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl border border-white">
                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden p-1 shrink-0 border border-slate-50">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-full h-full p-2 text-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{item.name || 'منتج غير معروف'}</p>
                          <p className="text-[10px] text-slate-400 font-bold">الكمية: {item.quantity || 0}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800">{(item.price || 0) * (item.quantity || 0)} {item.currency || 'SDG'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">التحكم في حالة الطلب</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {(['confirmed', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        className={cn(
                          "py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                          selectedOrder.status === status 
                            ? "premium-gradient text-white border-transparent shadow-lg"
                            : "bg-white text-slate-500 border-slate-100 hover:border-[#c2a67a]/30"
                        )}
                      >
                        {getStatusLabelAr(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-8 pt-4 border-t border-white/20 bg-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">إجمالي المبلغ</span>
                  <span className="text-2xl font-black text-emerald-900 lining-nums">{selectedOrder.total || 0} {selectedOrder.items?.[0]?.currency || 'SDG'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
