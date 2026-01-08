'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.welcome': 'Welcome to Sirizone Marketplace!',
    'header.cart': 'Cart',
    'header.wishlist': 'Wishlist',
    'header.account': 'My Account',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.orderTracking': 'Order Tracking',
    'header.aboutUs': 'About Us',
    
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.vendors': 'Vendors',
    'nav.pages': 'Pages',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Footer
    'footer.aboutCompany': 'About Company',
    'footer.ourStores': 'Our Stores',
    'footer.shopCategories': 'Shop Categories',
    'footer.usefulLinks': 'Useful Links',
    'footer.newsletter': 'Our Newsletter',
    'footer.subscribe': 'Subscribe',
    'footer.copyright': 'Copyright 2025 ©Sirizone. All rights reserved.',
    'footer.followUs': 'Follow Us:',
    'footer.paymentAccepts': 'Payment Accepts:',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.quickView': 'Quick View',
    'product.compare': 'Compare',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.featured': 'Featured',
    'product.newArrival': 'New Arrival',
    'product.sale': 'Sale',
    
    // Vendor Registration
    'vendor.register.title': 'Become a Vendor',
    'vendor.register.subtitle': 'Join Sirizone Marketplace and start selling today',
    'vendor.register.firstName': 'First Name',
    'vendor.register.lastName': 'Last Name',
    'vendor.register.email': 'Email Address',
    'vendor.register.phone': 'Phone Number',
    'vendor.register.storeName': 'Store Name',
    'vendor.register.storeDescription': 'Store Description',
    'vendor.register.address': 'Address',
    'vendor.register.city': 'City',
    'vendor.register.country': 'Country',
    'vendor.register.zipCode': 'ZIP Code',
    'vendor.register.businessType': 'Business Type',
    'vendor.register.taxId': 'Tax ID / Business License',
    'vendor.register.bankAccount': 'Bank Account Number',
    'vendor.register.bankName': 'Bank Name',
    'vendor.register.terms': 'I agree to the Terms and Conditions',
    'vendor.register.submit': 'Submit Application',
    'vendor.register.success': 'Application submitted successfully!',
    'vendor.register.autoExtension': 'A 3CX extension will be automatically created for you',
    
    // Admin
    'admin.settings.title': 'Store Settings',
    'admin.attributes': 'Attributes',
    'admin.categories': 'Categories',
    'admin.generalSettings': 'General Settings',
    'admin.add': 'Add',
    'admin.delete': 'Delete',
    'admin.save': 'Save Settings',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sortBy': 'Sort By',
    'common.viewAll': 'View All',
    'common.loadMore': 'Load More',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
  },
  ar: {
    // Header
    'header.welcome': 'مرحباً بك في سيري زون!',
    'header.cart': 'السلة',
    'header.wishlist': 'المفضلة',
    'header.account': 'حسابي',
    'header.login': 'تسجيل الدخول',
    'header.register': 'تسجيل جديد',
    'header.orderTracking': 'تتبع الطلب',
    'header.aboutUs': 'من نحن',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.vendors': 'البائعين',
    'nav.pages': 'الصفحات',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل بنا',
    
    // Footer
    'footer.aboutCompany': 'عن الشركة',
    'footer.ourStores': 'متاجرنا',
    'footer.shopCategories': 'تصنيفات المتجر',
    'footer.usefulLinks': 'روابط مفيدة',
    'footer.newsletter': 'النشرة الإخبارية',
    'footer.subscribe': 'اشترك',
    'footer.copyright': 'جميع الحقوق محفوظة 2025 ©سيري زون',
    'footer.followUs': 'تابعنا:',
    'footer.paymentAccepts': 'طرق الدفع:',
    
    // Product
    'product.addToCart': 'أضف للسلة',
    'product.buyNow': 'اشتر الآن',
    'product.quickView': 'نظرة سريعة',
    'product.compare': 'قارن',
    'product.inStock': 'متوفر',
    'product.outOfStock': 'غير متوفر',
    'product.featured': 'مميز',
    'product.newArrival': 'وصل حديثاً',
    'product.sale': 'تخفيض',
    
    // Vendor Registration
    'vendor.register.title': 'كن بائعاً',
    'vendor.register.subtitle': 'انضم إلى سيري زون وابدأ البيع اليوم',
    'vendor.register.firstName': 'الاسم الأول',
    'vendor.register.lastName': 'اسم العائلة',
    'vendor.register.email': 'البريد الإلكتروني',
    'vendor.register.phone': 'رقم الهاتف',
    'vendor.register.storeName': 'اسم المتجر',
    'vendor.register.storeDescription': 'وصف المتجر',
    'vendor.register.address': 'العنوان',
    'vendor.register.city': 'المدينة',
    'vendor.register.country': 'البلد',
    'vendor.register.zipCode': 'الرمز البريدي',
    'vendor.register.businessType': 'نوع النشاط',
    'vendor.register.taxId': 'الرقم الضريبي',
    'vendor.register.bankAccount': 'رقم الحساب البنكي',
    'vendor.register.bankName': 'اسم البنك',
    'vendor.register.terms': 'أوافق على الشروط والأحكام',
    'vendor.register.submit': 'إرسال الطلب',
    'vendor.register.success': 'تم إرسال الطلب بنجاح!',
    'vendor.register.autoExtension': 'سيتم إنشاء رقم داخلي 3CX تلقائياً',
    
    // Admin
    'admin.settings.title': 'إعدادات المتجر',
    'admin.attributes': 'الخصائص',
    'admin.categories': 'التصنيفات',
    'admin.generalSettings': 'الإعدادات العامة',
    'admin.add': 'إضافة',
    'admin.delete': 'حذف',
    'admin.save': 'حفظ الإعدادات',
    
    // Common
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sortBy': 'ترتيب حسب',
    'common.viewAll': 'عرض الكل',
    'common.loadMore': 'تحميل المزيد',
    'common.submit': 'إرسال',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.loading': 'جاري التحميل...',
  }
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
