# دليل إعداد Vercel KV (قاعدة البيانات)

## الخطوة 1: إنشاء Vercel KV Database

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى تبويب **Storage**
4. اضغط على **Create Database**
5. اختر **KV** (Key-Value Store)
6. اختر الخطة المجانية (Free tier - 256 MB)
7. اضغط **Create**

## الخطوة 2: إضافة Environment Variables

بعد إنشاء KV Database، Vercel سيضيف تلقائياً متغيرات البيئة التالية:

- `KV_REST_API_URL` - رابط API للـ KV
- `KV_REST_API_TOKEN` - Token للوصول

**ملاحظة:** هذه المتغيرات ستكون متاحة تلقائياً في جميع الـ deployments.

## الخطوة 3: إعادة النشر

1. اذهب إلى **Deployments**
2. اضغط على **Redeploy** للـ deployment الأخير
3. أو ادفع أي تغيير جديد إلى GitHub

## التحقق من العمل

بعد إعادة النشر:

1. اذهب إلى لوحة التحكم: `https://your-project.vercel.app/admin/login`
2. سجل الدخول
3. جرب إضافة/تعديل محتوى
4. البيانات الآن محفوظة بشكل دائم في Vercel KV

## بديل: استخدام Supabase (مجاني أيضاً)

إذا أردت استخدام Supabase بدلاً من Vercel KV:

1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. أنشئ جدول في قاعدة البيانات
4. أضف متغيرات البيئة:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## ملاحظات

- **Vercel KV** مجاني حتى 256 MB - كافي لمعظم المشاريع
- البيانات محفوظة بشكل دائم
- سريع جداً (Redis-based)
- لا يحتاج إعداد إضافي

## استكشاف الأخطاء

### البيانات لا تُحفظ
- تأكد من إضافة Environment Variables
- تأكد من إعادة النشر بعد إضافة المتغيرات

### خطأ في الاتصال بـ KV
- تأكد من أن KV Database تم إنشاؤه
- تأكد من Environment Variables موجودة في Vercel Dashboard

