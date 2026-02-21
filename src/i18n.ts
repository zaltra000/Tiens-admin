import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "products": "Products",
      "branches": "Branches",
      "inquiry": "Inquiry",
      "readMore": "Read More",
      "healthFood": "Health Food",
      "beautySkinCare": "Beauty And Skin Care",
      "personalCare": "Personal Care",
      "householdItems": "Household Items",
      "searchBranches": "Search branches...",
      "filterByState": "Filter by State",
      "allStates": "All States",
      "contactUs": "Contact Us",
      "fullName": "Full Name",
      "phoneNumber": "Phone Number",
      "message": "Message",
      "send": "Send",
      "certifications": "Certifications",
      "rightsReserved": "All rights reserved © 2025",
      "slogan": "Better Life, Better Future",
      "aboutTitle": "About Tiens",
      "inquirySubtitle": "We are here to help you",
      "successMessage": "Message sent successfully!",
      "viewDetails": "View Details",
      "sudanProducts": "Available in Sudan",
      "globalProducts": "Global Range",
      "notAvailable": "Not available in local branches",
      "countriesAndRegions": "Countries & Regions",
      "familiesServed": "Families Served",
      "branchesWorldwide": "Branches Worldwide",
      "shop": "Shop",
      "addToCart": "Add to Cart",
      "outOfStock": "Out of Stock",
      "cart": "My Cart",
      "subtotal": "Subtotal",
      "emptyCart": "Your cart is empty",
      "checkoutViaWhatsApp": "Order via WhatsApp",
      "checkoutViaFacebook": "Order via Facebook",
      "quantity": "Qty",
      "price": "Price",
      "totalPrice": "Total Price",
      "sdg": "SDG",
      "priceNotAvailable": "Price not set",
      "sendViaWhatsApp": "Send via WhatsApp",
      "sendViaFacebook": "Send via Facebook"
    }
  },
  ar: {
    translation: {
      "home": "الرئيسية",
      "products": "المنتجات",
      "branches": "الفروع",
      "inquiry": "إستفسار",
      "welcome": "مرحباً بكم في تينز السودان",
      "readMore": "اقرأ المزيد",
      "healthFood": "غذاء صحي",
      "beautySkinCare": "العناية بالبشرة والجمال",
      "personalCare": "عناية شخصية",
      "householdItems": "الأدوات المنزلية",
      "searchBranches": "ابحث عن فرع...",
      "filterByState": "تصفية حسب الولاية",
      "allStates": "كل الولايات",
      "contactUs": "تواصل معنا",
      "fullName": "الاسم الكامل",
      "phoneNumber": "رقم الهاتف",
      "message": "الرسالة",
      "send": "إرسال",
      "certifications": "الشهادات والاعتمادات",
      "rightsReserved": "جميع الحقوق محفوظة © 2025",
      "slogan": "حياة أفضل، مستقبل أفضل",
      "aboutTitle": "عن تينز",
      "inquirySubtitle": "نحن هنا لمساعدتك",
      "successMessage": "تم إرسال الرسالة بنجاح!",
      "viewDetails": "عرض التفاصيل",
      "sudanProducts": "متوفر في السودان",
      "globalProducts": "منتجات عالمية",
      "notAvailable": "غير متوفر في الفروع المحلية",
      "countriesAndRegions": "دولة ومنطقة",
      "familiesServed": "عائلة مستفيدة",
      "branchesWorldwide": "فرع حول العالم",
      "shop": "المتجر",
      "addToCart": "أضف للسلة",
      "outOfStock": "الكمية منتهية حالياً",
      "cart": "سلة المشتريات",
      "subtotal": "المجموع",
      "emptyCart": "السلة فارغة",
      "checkoutViaWhatsApp": "إتمام الطلب عبر واتساب",
      "checkoutViaFacebook": "إتمام الطلب عبر فيسبوك",
      "quantity": "الكمية",
      "price": "السعر",
      "totalPrice": "اجمالي السعر",
      "sdg": "ج.س",
      "priceNotAvailable": "تواصل لمعرفة السعر",
      "sendViaWhatsApp": "إرسال عبر واتساب",
      "sendViaFacebook": "إرسال عبر فيسبوك"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // Default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
