import React, { useState } from 'react';
import { InventoryData } from '../types';
import { Check, X, Search } from 'lucide-react';

interface Props {
  data: InventoryData;
  onUpdate: (key: string, value: boolean) => void;
}

export default function InventoryTab({ data, onUpdate }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = Object.entries(data).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
      </div>
      
      <div className="space-y-3">
        {filteredItems.map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-sm font-medium text-slate-900 truncate">{key}</h3>
              <span className={`inline-flex items-center gap-1 mt-1 text-xs font-medium ${
                value ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {value ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <button
              onClick={() => onUpdate(key, !value)}
              className={`w-12 h-8 rounded-full transition-colors relative flex items-center ${
                value ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <span className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform flex items-center justify-center ${
                value ? 'translate-x-4' : 'translate-x-0'
              }`}>
                {value ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}
              </span>
            </button>
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
