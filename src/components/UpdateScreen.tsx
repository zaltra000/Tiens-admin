import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Download, RefreshCw, Sparkles, Shield, ArrowDownCircle } from "lucide-react";
import type { AppUpdateInfo } from "@/lib/firebase";
import { APP_VERSION } from "@/lib/firebase";

interface UpdateScreenProps {
    updateInfo: AppUpdateInfo;
}

export default function UpdateScreen({ updateInfo }: UpdateScreenProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language as "ar" | "en";
    const changelog = lang === "ar" ? updateInfo.changelog_ar : updateInfo.changelog_en;

    const handleDownload = () => {
        if (updateInfo.apk_url) {
            window.open(updateInfo.apk_url, "_blank");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-gradient-to-br from-tiens-primary via-teal-600 to-emerald-900 flex items-center justify-center p-6"
        >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-tiens-accent/10 rounded-full -ml-20 -mb-20 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
                className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Top accent bar */}
                <div className="h-2 bg-gradient-to-r from-tiens-primary via-tiens-accent to-emerald-400" />

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Animated icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-tiens-primary/10 to-emerald-50 dark:from-tiens-primary/20 dark:to-emerald-900/20 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        >
                            <ArrowDownCircle className="w-10 h-10 text-tiens-primary dark:text-tiens-primary-light" />
                        </motion.div>
                    </motion.div>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                        {t("updateAvailable")}
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-sm text-gray-400 dark:text-zinc-500 font-mono">
                            v{APP_VERSION}
                        </span>
                        <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <RefreshCw className="w-4 h-4 text-tiens-primary" />
                        </motion.div>
                        <span className="text-sm font-bold text-tiens-primary dark:text-tiens-primary-light font-mono">
                            v{updateInfo.latest_version}
                        </span>
                    </div>

                    {/* Changelog */}
                    {changelog && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-6 text-start">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-tiens-accent" />
                                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                    {t("whatsNew")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                                {changelog}
                            </p>
                        </div>
                    )}

                    {/* Size badge */}
                    {updateInfo.apk_size_mb && (
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                                {t("updateSize")}: {updateInfo.apk_size_mb}
                            </span>
                        </div>
                    )}

                    {/* Download button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-tiens-primary to-emerald-600 text-white py-4 px-8 rounded-2xl font-black text-sm shadow-lg shadow-tiens-primary/30 active:shadow-md transition-shadow"
                    >
                        <Download className="w-5 h-5" />
                        {t("downloadUpdate")}
                    </motion.button>

                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-4 leading-relaxed">
                        {t("updateRequired")}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
