import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle, Award, Star, Users, Globe, MapPin, Sparkles, Building2 } from "lucide-react";

export default function HomeView({ onChangeView }: { onChangeView: (view: string) => void }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const isRTL = lang === "ar";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-28 pt-20 px-4 space-y-12 max-w-2xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-tiens-primary via-teal-600 to-emerald-800 text-white p-10 shadow-2xl shadow-tiens-primary/40 dark:shadow-black/50"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tiens-accent/20 rounded-full -ml-20 -mb-20 blur-2xl" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-tiens-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">
              Trusted Worldwide
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-md">
            {t("welcome")}
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-10 leading-relaxed max-w-[95%] font-medium text-balance drop-shadow-sm">
            {t("slogan")}
          </p>

          <button
            onClick={() => onChangeView("products")}
            className="group flex items-center justify-center gap-3 bg-white text-tiens-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-all hover:bg-gray-50 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
          >
            {t("products")}
            <div className="w-8 h-8 rounded-full bg-tiens-primary/10 flex items-center justify-center group-hover:bg-tiens-primary/20 transition-colors">
              <ArrowRight className={isRTL ? "rotate-180 w-4 h-4" : "w-4 h-4"} />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Founder Section */}
      <motion.div variants={item} className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50 to-white dark:from-zinc-800/50 dark:to-zinc-900 rounded-[2.5rem] -mx-2 sm:-mx-6 pointer-events-none -z-10" />
        <div className="px-2 sm:px-6 py-8">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center tracking-tight">
              {t("founderMessageTitle")}
            </h2>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="aspect-[4/3] sm:aspect-[16/9] w-full relative bg-gray-100 dark:bg-zinc-800">
              <img
                src="/image/مؤسس المجموعة/ljy.png"
                alt="Li Jinyuan, Chairman of Tiens Group"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                  {t("founderName").split("،")[0].split(",")[0]}
                </h3>
                <p className="text-white/80 text-sm font-medium drop-shadow-md">
                  {t("founderName").split("،")[1] || t("founderName").split(",")[1]}
                </p>
              </div>
            </div>

            <div className="p-8 relative">
              <div className="absolute top-0 right-10 -mt-6">
                <div className="bg-tiens-accent text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform rotate-3">
                  <span className="text-3xl leading-none">"</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-tiens-primary dark:text-tiens-primary-light mb-4 text-balance">
                {t("founderMessageSubtitle")}
              </h4>
              <p className="text-gray-600 dark:text-zinc-300 leading-loose text-sm font-medium text-justify">
                {t("founderMessageTxt")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-4 text-tiens-primary dark:text-tiens-primary-light group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">40M+</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t("familiesServed")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">224</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t("countriesAndRegions")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 col-span-2 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-2xl" />
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 text-blue-500 dark:text-blue-400 z-10 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 z-10">110+</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider z-10">{t("branchesWorldwide")}</p>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div variants={item} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-zinc-800/50 rounded-bl-full -mr-10 -mt-10" />

        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-tiens-primary/10 dark:bg-tiens-primary-light/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-tiens-primary dark:text-tiens-primary-light" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            {t("companyOverviewTitle")}
          </h2>
        </div>

        <p className="text-gray-600 dark:text-zinc-300 leading-loose text-sm font-medium mb-8 relative z-10 text-justify">
          {t("companyOverviewTxt")}
        </p>

        <div className="flex flex-wrap gap-2 relative z-10">
          {[
            { label: "ISO Certified", color: "blue", icon: Award },
            { label: "FDA Compliant", color: "green", icon: CheckCircle },
            { label: "GMP Standard", color: "purple", icon: Award },
          ].map((tag, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-${tag.color}-50 dark:bg-${tag.color}-900/20 text-${tag.color}-600 dark:text-${tag.color}-400 border border-${tag.color}-100 dark:border-${tag.color}-900/30`}
            >
              <tag.icon className="w-4 h-4" />
              {tag.label}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
