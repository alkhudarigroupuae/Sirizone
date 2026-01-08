# Integration Setup Guide
# دليل إعداد التكاملات

## ✅ Google Analytics & Search Console

### 1. إنشاء حساب Google Analytics

1. اذهب إلى https://analytics.google.com
2. أنشئ حساب جديد
3. أضف موقعك الإلكتروني
4. احصل على Measurement ID (مثل: G-XXXXXXXXXX)
5. ضعه في `.env.production`:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. إعداد Google Search Console

1. اذهب إلى https://search.google.com/search-console
2. أضف موقعك
3. احصل على كود التحقق
4. ضعه في `.env.production`:
```bash
NEXT_PUBLIC_GSC_VERIFICATION=your_verification_code
```

5. ارفع Sitemap:
   - انتظر البناء ثم ارفع: `https://yourdomain.com/sitemap.xml`

### للبائعين - SEO Optimization:

كل صفحة منتج تحتوي على:
- ✅ Structured Data (Schema.org)
- ✅ Meta Tags
- ✅ Open Graph
- ✅ تتبع الأداء

---

## 💳 Stripe Payment Integration

### 1. إنشاء حساب Stripe

1. اذهب إلى https://dashboard.stripe.com/register
2. أنشئ حساب
3. احصل على API Keys من: Developers → API Keys

### 2. Test Mode (للتطوير)
```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

### 3. Live Mode (للإنتاج)
```bash
# .env.production
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
```

### 4. تثبيت المكتبات:
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### 5. اختبار الدفع:
```
بطاقة تجريبية: 4242 4242 4242 4242
CVV: أي 3 أرقام
تاريخ انتهاء: أي تاريخ مستقبلي
```

---

## 💰 PayPal Integration

### 1. إنشاء حساب PayPal Business

1. اذهب إلى https://www.paypal.com/bizsignup
2. أنشئ حساب Business
3. اذهب إلى https://developer.paypal.com

### 2. Sandbox (للتطوير)
```bash
# .env.local
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_SECRET=your_sandbox_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

### 3. Live Mode (للإنتاج)
```bash
# .env.production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_SECRET=your_live_secret
PAYPAL_API_URL=https://api-m.paypal.com
```

### 4. تثبيت المكتبات:
```bash
npm install @paypal/react-paypal-js
```

---

## 📞 3CX Integration (نظام المقسم)

### 1. متطلبات 3CX

- ✅ خادم 3CX مثبت (On-premise أو Cloud)
- ✅ رخصة تدعم Web Client
- ✅ API Access مفعّل

### 2. إعداد 3CX API

1. سجل دخول لـ 3CX Management Console
2. اذهب إلى Settings → API
3. فعّل API Access
4. أنشئ API Token

### 3. إضافة بيانات 3CX:
```bash
# .env.production
NEXT_PUBLIC_3CX_DOMAIN=your-3cx-server.com
CX_API_URL=https://your-3cx-server.com:5001/api
CX_API_TOKEN=your_api_token
```

### 4. إنشاء Extension للبائع:

عند تسجيل بائع جديد، سيحصل تلقائياً على:
- ✅ رقم داخلي (Extension): مثل 2001, 2002...
- ✅ حساب SIP
- ✅ WebClient Access
- ✅ تسجيل المكالمات

### 5. استخدام API:

```typescript
import { createVendorExtension, getVendorWebClientUrl } from '@/lib/3cx';

// إنشاء رقم للبائع
const result = await createVendorExtension({
  id: 'vendor123',
  name: 'أحمد محمد',
  email: 'vendor@example.com',
  phone: '+963123456789'
});

console.log('Extension Number:', result.extensionNumber);
console.log('Web Client URL:', getVendorWebClientUrl('vendor123'));
```

---

## 📦 تثبيت جميع المكتبات المطلوبة

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js @paypal/react-paypal-js
```

---

## 🧪 اختبار التكاملات

### Test Google Analytics:
1. افتح الموقع
2. افتح Google Analytics Real-Time
3. تأكد من ظهور الزيارة

### Test Stripe:
```bash
# بطاقة تجريبية ناجحة
4242 4242 4242 4242

# بطاقة تجريبية مرفوضة
4000 0000 0000 0002
```

### Test PayPal:
استخدم حساب Sandbox من PayPal Developer Dashboard

### Test 3CX:
```bash
curl -X POST https://your-3cx-server.com:5001/api/ExtensionList \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"Number":"2001","FirstName":"Test"}'
```

---

## 🚀 الملفات المطلوبة

تم إنشاء:
- ✅ `src/lib/analytics.ts` - Google Analytics & SEO
- ✅ `src/lib/payment.ts` - Stripe & PayPal
- ✅ `src/lib/3cx.ts` - 3CX Integration
- ✅ `src/app/api/payment/stripe/route.ts` - Stripe API
- ✅ `src/app/api/payment/paypal/route.ts` - PayPal API
- ✅ `src/app/api/vendor/extension/route.ts` - 3CX API
- ✅ `src/components/common/PaymentGateway.tsx` - واجهة الدفع
- ✅ `.env.production` - متغيرات الإنتاج

---

## 📊 Dashboard للبائع

كل بائع سيحصل على:
1. **رقم داخلي (Extension)** من 3CX
2. **تتبع المبيعات** عبر Google Analytics
3. **حساب Stripe Connect** لاستلام الأموال
4. **SEO Tools** لتحسين منتجاته

---

## 🔐 الأمان

- ✅ API Keys في environment variables فقط
- ✅ HTTPS إلزامي للإنتاج
- ✅ Webhook signatures للتحقق من Stripe/PayPal
- ✅ Rate limiting على API endpoints

---

## 💡 ملاحظات مهمة

1. **Stripe Connect** للمدفوعات الموزعة (Marketplace):
   - احتفظ بنسبة عمولة (مثلاً 15%)
   - حوّل الباقي للبائع

2. **3CX Extensions**:
   - كل بائع رقم فريد
   - تسجيل جميع المكالمات
   - تقارير للأداء

3. **Google Search Console**:
   - كل بائع يمكنه رؤية أداء منتجاته
   - Rich Results للمنتجات
   - Structured Data تلقائي

هل تريد البدء بأي من هذه التكاملات؟ 🚀
