import React, { useState } from 'react';
import { PricesData } from '../types';
import { Search, Save, Edit2, X } from 'lucide-react';

interface Props {
  data: PricesData;
  onUpdate: (key: string, value: number) => void;
}

export default function PricesTab({ data, onUpdate }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const filteredItems = Object.entries(data).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (key: string, currentValue: number) => {
    setEditingKey(key);
    setEditValue(currentValue.toString());
  };

  const handleSave = (key: string) => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue)) {
      onUpdate(key, numValue);
    }
    setEditingKey(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
      </div>
      
      <div className="space-y-3">
        {filteredItems.map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-900 truncate flex-1 pr-2">{key}</h3>
              {editingKey !== key && (
                <button
                  onClick={() => handleEdit(key, value)}
                  className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {editingKey === key ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  autoFocus
                />
                <button
                  onClick={() => handleSave(key)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingKey(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-lg font-semibold text-slate-700">
                {value.toLocaleString()}
              </div>
            )}
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100 border-dashed">
            <p>No items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
