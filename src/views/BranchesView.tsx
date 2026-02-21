import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { tiensData } from "@/data/tiensData";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BranchesView() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const branches = tiensData[lang].branches;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  const states = ["All", ...new Set(branches.map(b => b.state))];

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          branch.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "All" || branch.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="pb-24 pt-20 px-4 h-full flex flex-col max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-1 transition-colors duration-500">{t("branches")}</h2>

      {/* Search & Filter */}
      <div className="space-y-4 mb-6 sticky top-16 bg-bg-soft/95 dark:bg-zinc-950/95 backdrop-blur-md z-30 py-4 -mx-4 px-4 border-b border-gray-200/50 dark:border-zinc-800/50 transition-colors duration-500">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500 rtl:left-auto rtl:right-4 group-focus-within:text-tiens-primary dark:group-focus-within:text-tiens-primary-light transition-colors" />
          <input
            type="text"
            placeholder={t("searchBranches")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 rtl:pl-4 rtl:pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-tiens-primary/20 dark:focus:ring-tiens-primary-light/20 focus:border-tiens-primary dark:focus:border-tiens-primary-light transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                selectedState === state
                  ? "bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-100 shadow-md"
                  : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              )}
            >
              {state === "All" ? t("allStates") : state}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredBranches.map((branch, index) => (
            <motion.div
              key={`${branch.city}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex gap-4 items-center hover:shadow-md transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center flex-shrink-0 group-hover:bg-tiens-primary dark:group-hover:bg-tiens-primary-light group-hover:text-white dark:group-hover:text-zinc-900 transition-colors text-tiens-primary dark:text-tiens-primary-light">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors duration-500">{branch.city}</h3>
                  <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors duration-500">
                    {branch.state}
                  </span>
                </div>
                <p className="text-tiens-primary dark:text-tiens-primary-light font-semibold text-sm transition-colors duration-500">{branch.location}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredBranches.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-zinc-500 transition-colors duration-500">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500">
              <Search className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
            </div>
            <p className="font-medium">{t("noResults") || "No branches found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
