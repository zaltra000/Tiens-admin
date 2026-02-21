import { useState, FormEvent, MouseEvent } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Send, CheckCircle, Facebook, Globe } from "lucide-react";

export default function InquiryView() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedPlatform, setSubmittedPlatform] = useState<"whatsapp" | "facebook">("whatsapp");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const whatsappNumber = "249126284069";
  const facebookUrl = "https://www.facebook.com/share/1DuXR3qVBi/";

  const handleWhatsAppSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest('form');
    if (form && form.reportValidity()) {
      const text = `*New Inquiry from Tiens App*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Message:* ${formData.message}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

      setSubmittedPlatform("whatsapp");
      setIsSubmitted(true);
      setFormData({ name: "", phone: "", message: "" });
    }
  };

  const handleFacebookSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest('form');
    if (form && form.reportValidity()) {
      const text = `*New Inquiry from Tiens App*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Message:* ${formData.message}`;
      navigator.clipboard.writeText(text).catch(() => { });
      window.open(facebookUrl, '_blank');

      setSubmittedPlatform("facebook");
      setIsSubmitted(true);
      setFormData({ name: "", phone: "", message: "" });
    }
  };

  const handleDirectWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 pb-32 pt-28 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-green-500 dark:text-green-400 shadow-lg shadow-green-500/10 dark:shadow-green-900/20 transition-colors duration-500"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">{t("successMessage")}</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mb-10 leading-relaxed transition-colors duration-500">
          {submittedPlatform === "whatsapp"
            ? "Thank you! We have opened WhatsApp for you to send the message."
            : "Text copied! We have opened Facebook for you to PASTE the details and send."}
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-tiens-primary dark:bg-tiens-primary-light text-white dark:text-zinc-900 px-10 py-4 rounded-2xl font-bold shadow-xl shadow-tiens-primary/20 dark:shadow-tiens-primary-light/20 active:scale-95 transition-all w-full"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-28 px-4 h-full flex flex-col max-w-lg mx-auto">
      <div className="mb-8 px-1">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">{t("inquiry")}</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm transition-colors duration-500">{t("inquirySubtitle")}</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-500"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ml-1 transition-colors duration-500">
            {t("fullName")}
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-tiens-primary dark:focus:border-tiens-primary-light rounded-xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-tiens-primary/10 dark:focus:ring-tiens-primary-light/10 transition-all font-medium"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ml-1 transition-colors duration-500">
            {t("phoneNumber")}
          </label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-tiens-primary dark:focus:border-tiens-primary-light rounded-xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-tiens-primary/10 dark:focus:ring-tiens-primary-light/10 transition-all font-medium"
            placeholder="+249..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider ml-1 transition-colors duration-500">
            {t("message")}
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-tiens-primary dark:focus:border-tiens-primary-light rounded-xl px-4 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-tiens-primary/10 dark:focus:ring-tiens-primary-light/10 transition-all resize-none font-medium"
            placeholder="How can we help you?"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleFacebookSubmit}
            className="w-full bg-[#1877F2] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#1877F2]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#1877F2]/30"
          >
            <Facebook className="w-4 h-4" />
            {t("sendViaFacebook")}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppSubmit}
            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#25D366]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-[#25D366]/30"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.015-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            {t("sendViaWhatsApp")}
          </button>
        </div>
      </motion.form>

      {/* Direct Contact Options */}
      <div className="mt-10">
        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-4 font-medium uppercase tracking-wide text-center transition-colors duration-500">Or contact us directly</p>

        <div className="flex flex-col gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleDirectWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-[#25D366]/30 transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.015-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            WhatsApp
          </button>

          <div className="grid grid-cols-2 gap-3">
            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-[#1877F2]/30 transition-all active:scale-95"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </a>

            {/* Website */}
            <a
              href="https://www.tiens.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 dark:bg-zinc-800 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-gray-800/30 dark:hover:shadow-zinc-800/30 transition-all active:scale-95"
            >
              <Globe className="w-5 h-5" />
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
