import React, { useState, useEffect } from 'react';
import { Product, LocalizedContent } from '../types';
import { Edit2, Save, X, Image as ImageIcon, ChevronLeft, Plus, Globe, Trash2, Upload, Loader2, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: Record<string, Product>;
  onUpdate: (id: string, product: Product) => void;
  onDelete: (id: string) => void;
  isAddModalOpen: boolean;
  closeAddModal: () => void;
}

export default function ProductsTab({ data, onUpdate, onDelete, isAddModalOpen, closeAddModal }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    const isModalOpen = !!editingId || !!deleteId;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingId, deleteId]);

  // Effect to handle opening the add modal from parent prop
  useEffect(() => {
    if (isAddModalOpen) {
      handleCreate();
    }
  }, [isAddModalOpen]);

  const handleEdit = (id: string, product: Product) => {
    setEditingId(id);
    setEditForm(JSON.parse(JSON.stringify(product))); // Deep copy
  };

  const handleCreate = () => {
    const newId = `p${Date.now()}`;
    setEditingId(newId);
    setEditForm({
      id: newId,
      price: 0,
      currency: 'SDG',
      category: '',
      element: '',
      image: '',
      inStock: true,
      ar: { name: '', description: '', benefits: [] },
      en: { name: '', description: '', benefits: [] }
    });
  };

  const handleSave = () => {
    if (!editForm.id) {
      alert('المعرف (ID) مطلوب');
      return;
    }
    
    const ar = editForm.ar || { name: '', description: '', benefits: [] };
    const en = editForm.en || { name: '', description: '', benefits: [] };

    if (!ar.name) {
      alert('الاسم مطلوب');
      return;
    }

    const productToSave = {
      ...editForm,
      ar,
      en: en.name ? en : ar // Safe fallback
    } as Product;

    onUpdate(editForm.id, productToSave);
    handleCancel();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    if (isAddModalOpen) closeAddModal();
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      if (editingId === deleteId) {
        handleCancel();
      }
      setDeleteId(null);
    }
  };

  const productsList = Object.entries(data);

  return (
    <div className="space-y-8 pb-32" dir="rtl">
      <AnimatePresence mode="popLayout">
        {productsList.map(([id, product], index) => {
          const name = product.ar?.name || product.en?.name || 'بدون اسم';
          
          return (
            <motion.div 
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                delay: Math.min(index * 0.05, 0.5) 
              }}
              className="glass rounded-[3rem] p-6 shadow-premium border-white/60 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:shadow-pine-900/10 transition-all group relative overflow-hidden card-shine"
            >
              <div className="w-full sm:w-40 h-40 rounded-[2rem] overflow-hidden bg-white shrink-0 border border-slate-100 relative shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                {product.image ? (
                  <img src={product.image} alt={name} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] flex items-center justify-center">
                    <span className="premium-gradient text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg border border-white/20 uppercase tracking-[0.2em]">نفذت الكمية</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-between flex-1 min-w-0 py-1 relative z-10 text-right">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-pine-900 font-black text-xl truncate leading-tight mb-2">{name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-4 py-1.5 glass text-pine-800 text-[10px] font-black rounded-xl border-white/80 shadow-sm uppercase tracking-wider">
                          {product.category || 'بدون تصنيف'}
                        </span>
                        {product.element && (
                          <span className="px-4 py-1.5 bg-gold-500/10 text-gold-600 text-[10px] font-black rounded-xl border border-gold-500/20 uppercase tracking-wider">
                            {product.element}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(id, product)}
                      className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-pine-800 hover:premium-gradient hover:text-white transition-all shadow-sm border-white"
                    >
                      <Edit2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex items-end justify-between mt-6">
                  <div className="premium-gradient px-6 py-3 rounded-2xl shadow-premium border border-white/10">
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">القيمة</p>
                    <p className="text-2xl font-black text-white leading-none lining-nums">
                      {product.price} <span className="text-sm font-black text-[#d4af37] mr-1 uppercase">{product.currency}</span>
                    </p>
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(id);
                    }}
                    className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm group/del"
                  >
                    <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {productsList.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 glass rounded-[3rem] border-dashed border-2 border-slate-200"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">لا يوجد أصول مكتشفة حالياً</p>
        </motion.div>
      )}

      <AnimatePresence>
        {editingId && (
          <ProductEditor 
            form={editForm} 
            setForm={setEditForm} 
            onSave={handleSave} 
            onCancel={handleCancel} 
            onDelete={() => setDeleteId(editingId)}
            isNew={isAddModalOpen}
          />
        )}
        {deleteId && (
          <DeleteConfirmationModal 
            onConfirm={confirmDelete} 
            onCancel={() => setDeleteId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DeleteConfirmationModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-pine-900/40 backdrop-blur-xl p-6"
      dir="rtl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="glass rounded-[3.5rem] p-10 w-full max-w-md shadow-2xl border-white ring-1 ring-black/5"
      >
        <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-500 border-8 border-white shadow-premium">
          <Trash2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-pine-900 mb-3 text-center uppercase tracking-tight">حذف الأصل؟</h3>
        <p className="text-slate-500 mb-12 text-center text-sm font-bold leading-relaxed px-4">هذا الإجراء سيقوم بإزالة هذا المنتج نهائياً من قاعدة البيانات المركزية. لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="w-full py-5 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-600 transition-colors uppercase tracking-[0.2em] text-[10px]"
          >
            تأكيد الحذف النهائي
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="w-full py-5 glass text-pine-800 font-black rounded-2xl border-white hover:bg-white transition-colors uppercase tracking-[0.2em] text-[10px]"
          >
            إلغاء العملية
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductEditor({ form, setForm, onSave, onCancel, onDelete, isNew }: any) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (field: keyof Product, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleLocalizedChange = (lang: 'ar' | 'en', field: keyof LocalizedContent, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85)); // Compressed high quality
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const base64Image = await resizeImage(file);
      handleChange('image', base64Image);
      setUploading(false);
    } catch (error: any) {
      console.error("Error processing image:", error);
      setUploadError(`فشل في معالجة الصور: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-[900] bg-[#f8f9fa] flex flex-col selection:bg-[#d4af37]/30"
      dir="rtl"
    >
      {/* Header */}
      <div className="px-6 py-6 glass border-b border-white sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="w-14 h-14 flex items-center justify-center glass text-pine-800 rounded-2xl border-white shadow-sm hover:bg-white transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <h3 className="text-xl font-black text-pine-900 uppercase tracking-[0.2em]">
          {isNew ? 'إضافة أصل جديد' : 'تعديل بيانات الأصل'}
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="flex items-center gap-3 px-8 py-4 premium-gradient text-white font-black text-xs rounded-2xl shadow-premium uppercase tracking-[0.2em] border border-white/10"
        >
          <Save className="w-5 h-5" />
          حفظ البيانات
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-12 pb-48 max-w-4xl mx-auto w-full no-scrollbar">
        {/* Main Info Card */}
        <div className="glass rounded-[3.5rem] p-10 border-white space-y-10 shadow-premium group">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <h4 className="font-black text-pine-900 uppercase tracking-widest text-base">البيانات الأساسية</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">معايير الهوية والتقييم</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2">المعرف الرقمي (ID)</label>
              <input
                type="text"
                value={form.id || ''}
                onChange={(e) => handleChange('id', e.target.value)}
                disabled={!isNew}
                className="w-full px-7 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all disabled:opacity-40 font-mono text-sm font-bold shadow-inner"
                dir="ltr"
                placeholder="pXXXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2 text-right">السعر</label>
                <input
                  type="number"
                  value={form.price || 0}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  className="w-full px-7 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all font-black text-2xl text-pine-900 lining-nums shadow-inner text-center"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2 text-right">العملة</label>
                <input
                  type="text"
                  value={form.currency || ''}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-7 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all text-center font-black text-pine-800 uppercase shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2">التصنيف</label>
              <input
                type="text"
                value={form.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-7 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all font-bold text-base text-pine-900 shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2">العنصر</label>
              <input
                type="text"
                value={form.element || ''}
                onChange={(e) => handleChange('element', e.target.value)}
                className="w-full px-7 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all font-bold text-base text-pine-900 shadow-inner"
              />
            </div>
          </div>

          <motion.label 
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${form.inStock ?? true ? 'bg-white border-white shadow-premium' : 'bg-slate-50 border-slate-100 opacity-60'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${form.inStock ?? true ? 'premium-gradient' : 'bg-slate-200'}`}>
              {(form.inStock ?? true) ? <CheckCircle className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-slate-400" />}
            </div>
            <input
              type="checkbox"
              checked={form.inStock ?? true}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="hidden"
            />
            <div className="flex-1 text-right">
              <span className="text-sm font-black text-pine-900 uppercase tracking-widest block">التوفر في المخزن</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">حالة التوفر الحالية للأصل</span>
            </div>
          </motion.label>
        </div>

        {/* Visual Identity Card */}
        <div className="glass rounded-[3.5rem] p-10 border-white space-y-8 shadow-premium">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
              <ImageIcon className="w-7 h-7 text-[#d4af37]" />
            </div>
            <div className="text-right">
              <h4 className="font-black text-pine-900 uppercase tracking-widest text-base">بصمة الهوية البصرية</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">التمثيل المرئي للأصل</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {form.image ? (
              <div className="relative w-full aspect-video glass rounded-[2.5rem] overflow-hidden border-white group shadow-inner flex items-center justify-center bg-white/20">
                <img 
                  src={form.image} 
                  alt="Asset Preview" 
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleChange('image', '')}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-red-500 rounded-2xl font-black text-[11px] shadow-2xl uppercase tracking-[0.2em] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    حذف الصورة
                  </motion.button>
                </div>
              </div>
            ) : (
              <label className={`w-full aspect-video flex flex-col items-center justify-center gap-5 rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50 hover:bg-white hover:border-[#d4af37]/30 transition-all cursor-pointer group shadow-inner ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#d4af37]" />
                    <span className="text-[11px] font-black text-pine-800 uppercase tracking-[0.3em]">جاري المعالجة...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 glass rounded-[2rem] shadow-premium flex items-center justify-center border-white group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="text-center px-4">
                      <span className="text-sm font-black text-pine-900 uppercase tracking-widest block mb-1">رفع صورة المنتج</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">يدعم الصيغ عالية الجودة</span>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
            
            <div className="relative">
              <input
                type="text"
                value={form.image || ''}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="رابط الصورة الخارجي (URL)"
                className="w-full px-8 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all text-xs font-mono text-slate-500 pr-16 shadow-inner text-right"
                dir="ltr"
              />
              <Globe className="w-6 h-6 text-slate-200 absolute right-7 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Localized Content Card */}
        <div className="glass rounded-[3.5rem] p-10 border-white shadow-premium space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2">اسم المنتج بالعربية</label>
            <input
              type="text"
              value={form.ar?.name || ''}
              onChange={(e) => handleLocalizedChange('ar', 'name', e.target.value)}
              className="w-full px-8 py-6 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all font-black text-pine-900 text-2xl shadow-inner text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mr-2">وصف المنتج</label>
            <textarea
              value={form.ar?.description || ''}
              onChange={(e) => handleLocalizedChange('ar', 'description', e.target.value)}
              rows={6}
              className="w-full px-8 py-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#d4af37] focus:ring-0 transition-all resize-none font-bold text-base text-slate-600 leading-relaxed shadow-inner text-right"
              dir="rtl"
            />
          </div>
        </div>

        {!isNew && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onDelete}
            className="w-full py-6 bg-red-50 text-red-500 font-black rounded-[2.5rem] border-2 border-white hover:bg-red-500 hover:text-white transition-all shadow-premium flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px]"
          >
            <Trash2 className="w-6 h-6" />
            حذف سجل المنتج نهائياً
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
