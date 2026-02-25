import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Award, Globe, Users, Building2, ArrowRight, Quote, ShieldCheck, Briefcase } from "lucide-react";

interface HomeViewProps {
  onChangeView: (view: string) => void;
}

export default function HomeView({ onChangeView }: HomeViewProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { icon: Globe, value: "224", label: t("countriesAndRegions"), color: "bg-blue-500" },
    { icon: Users, value: "50M+", label: t("familiesServed"), color: "bg-emerald-500" },
    { icon: Building2, value: "35+", label: t("sudanBranches"), color: "bg-purple-500" },
    { icon: Award, value: "ISO, FDA", label: t("certifications"), color: "bg-amber-500" },
  ];

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 🔴 شريط الاختبار للإصدار الجديد 🔴 */}
      <div dir="ltr" className="w-full bg-emerald-600 text-white text-center font-bold text-sm py-2 px-4 shadow-md z-50 sticky top-0 animate-pulse">
        ✅ Update Success: Version 1.0.6 Installed
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/tiens-hq.jpg" 
            alt="Tiens HQ" 
            className="w-full h-full object-cover opacity-20"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-soft/60 via-bg-soft/80 to-bg-soft dark:from-zinc-950/60 dark:via-zinc-950/80 dark:to-zinc-950" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-4 rounded-full bg-tiens-primary/10 text-tiens-primary dark:text-tiens-primary-light font-bold text-sm mb-4 border border-tiens-primary/20 backdrop-blur-sm">
              Tiens Group - Sudan Branch
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 drop-shadow-sm">
              TIENS SUDAN
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-bold mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("slogan")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChangeView('products')}
              className="bg-gradient-to-r from-tiens-primary to-emerald-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-tiens-primary/30 flex items-center gap-2 mx-auto text-lg"
            >
              {t("readMore")}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid (Updated based on PDF) */}
      <section className="px-4 py-8 relative -mt-10 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-black/40 text-center border border-gray-100 dark:border-white/5"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center text-current`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h4>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section & MLM Opportunity (From PDF) */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Overview */}
          <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-tiens-primary/10 rounded-xl text-tiens-primary"><Globe className="w-6 h-6" /></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("companyOverviewTitle")}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-justify font-medium">
              {t("companyOverviewTxt")}
            </p>
          </motion.div>

          {/* Business Model */}
          <motion.div initial={{ opacity: 0, x: isRTL ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-tiens-primary to-emerald-700 rounded-3xl p-8 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Briefcase className="w-6 h-6" /></div>
              <h2 className="text-2xl font-bold">{t("mlmTitle")}</h2>
            </div>
            <p className="text-emerald-50 leading-relaxed text-justify font-medium mb-6">
              {t("mlmTxt")}
            </p>
            <button onClick={() => onChangeView('branches')} className="w-full py-3 bg-white text-tiens-primary rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-inner">
              {t("contactUs")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="px-4 pb-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-gray-100 dark:border-white/5 text-center md:text-start">
          <div className="p-4 bg-amber-500/10 rounded-full text-amber-500 shrink-0">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("qualityTitle")}</h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">{t("qualityTxt")}</p>
          </div>
        </motion.div>
      </section>

      {/* Founder Message */}
      <section className="px-4 pb-12 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tiens-primary/5 rounded-bl-full -mr-10 -mt-10" />
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div variants={item} className="w-full md:w-1/3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800">
                <img 
                  src="/images/li-jinyuan.jpg" 
                  alt={t("founderName")}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"; }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-bold text-sm text-center">{t("founderName")}</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={item} className="w-full md:w-2/3">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-tiens-primary">
                <Quote className="w-8 h-8 opacity-40" />
                <h2 className="text-2xl font-bold">{t("founderMessageTitle")}</h2>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 font-serif italic text-center md:text-start">
                "{t("founderMessageSubtitle")}"
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-justify font-medium">
                {t("founderMessageTxt")}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
