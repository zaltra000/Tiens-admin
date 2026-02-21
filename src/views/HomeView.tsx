import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { tiensData } from "@/data/tiensData";
import { ArrowRight, CheckCircle, Award, Star, Users, Globe, MapPin } from "lucide-react";

export default function HomeView({ onChangeView }: { onChangeView: (view: string) => void }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const data = tiensData[lang];
  const isRTL = lang === "ar";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-24 pt-20 px-4 space-y-8 max-w-lg mx-auto"
    >
      {/* Hero Section */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-tiens-primary to-tiens-primary-dark dark:from-tiens-primary-dark dark:to-zinc-900 text-white p-8 shadow-2xl shadow-tiens-primary/30 dark:shadow-black/50 transition-colors duration-500"
      >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-tiens-accent/20 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-semibold backdrop-blur-md uppercase tracking-wider">
              Since 1992
            </span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3 h-3 text-tiens-accent fill-tiens-accent" />
              ))}
            </div>
          </motion.div>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">
            {t("welcome")}
          </h1>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-[90%] font-medium">
            {t("slogan")}
          </p>
          
          <button 
            onClick={() => onChangeView("products")}
            className="group flex items-center gap-3 bg-white dark:bg-zinc-800 text-tiens-primary dark:text-tiens-primary-light px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-zinc-700"
          >
            {t("products")}
            <div className="w-6 h-6 rounded-full bg-tiens-primary/10 dark:bg-tiens-primary-light/10 flex items-center justify-center group-hover:bg-tiens-primary/20 dark:group-hover:bg-tiens-primary-light/20 transition-colors">
              <ArrowRight className={isRTL ? "rotate-180 w-3.5 h-3.5" : "w-3.5 h-3.5"} />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center card-hover transition-colors duration-500">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-3 text-tiens-primary dark:text-tiens-primary-light">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-500">40M+</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium transition-colors duration-500">{t("familiesServed")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center card-hover transition-colors duration-500">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-3 text-orange-500 dark:text-orange-400">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-500">190+</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium transition-colors duration-500">{t("countriesAndRegions")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center card-hover transition-colors duration-500 col-span-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3 text-blue-500 dark:text-blue-400">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-500">110+</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium transition-colors duration-500">{t("branchesWorldwide")}</p>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{t("aboutTitle")}</h2>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 rounded-bl-full -mr-4 -mt-4 transition-colors duration-500" />
          
          <p className="text-gray-600 dark:text-zinc-300 leading-relaxed text-sm mb-6 relative z-10 transition-colors duration-500">
            {data.company.description}
          </p>
          
          <div className="flex flex-wrap gap-2 relative z-10">
            {[
              { label: "ISO Certified", color: "blue", icon: Award },
              { label: "FDA Approved", color: "green", icon: CheckCircle },
              { label: "GMP Standard", color: "purple", icon: Award },
            ].map((tag, i) => (
              <div 
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-${tag.color}-50 dark:bg-${tag.color}-900/20 text-${tag.color}-600 dark:text-${tag.color}-400 border border-${tag.color}-100 dark:border-${tag.color}-900/30 transition-colors duration-500`}
              >
                <tag.icon className="w-3.5 h-3.5" />
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
