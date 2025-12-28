# دليل رفع المشروع على Vercel

## الخطوات:

### 1. التأكد من أن المشروع جاهز:
- ✅ جميع الملفات محفوظة
- ✅ لا توجد أخطاء في الكود
- ✅ `vercel.json` موجود ومضبوط

### 2. رفع المشروع على Vercel:

#### الطريقة الأولى: من خلال Vercel Dashboard
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل الدخول أو أنشئ حساب
3. اضغط على **"Add New Project"**
4. اختر المستودع (GitHub/GitLab/Bitbucket) أو ارفع المشروع مباشرة
5. Vercel سيكتشف تلقائياً:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. اضغط **"Deploy"**

#### الطريقة الثانية: من خلال Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# رفع المشروع
vercel

# للمتابعة في الإنتاج
vercel --prod
```

### 3. إعداد Environment Variables (مهم جداً):

بعد الرفع الأول، يجب إضافة Environment Variables:

1. اذهب إلى **Project Settings** → **Environment Variables**
2. أضف المتغيرات التالية (إذا كنت تستخدم Vercel KV):

```
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
```

**ملاحظة:** إذا لم تكن تستخدم Vercel KV بعد، يمكنك تخطي هذه الخطوة.

### 4. تهيئة قاعدة البيانات:

بعد الرفع الناجح:

1. اذهب إلى: `https://your-project.vercel.app/api/init`
2. يجب أن ترى رسالة نجاح
3. الآن يمكنك تسجيل الدخول إلى لوحة التحكم

### 5. تسجيل الدخول إلى لوحة التحكم:

1. اذهب إلى: `https://your-project.vercel.app/admin/login`
2. استخدم:
   - **اسم المستخدم:** `admin`
   - **كلمة المرور:** `admin123`

## ملاحظات مهمة:

- ✅ تأكد من أن `vercel.json` موجود في root المشروع
- ✅ تأكد من أن `package.json` يحتوي على `build` script
- ✅ بعد أي تغيير في Environment Variables، يجب إعادة النشر (Redeploy)
- ✅ يمكنك ربط المشروع بـ GitHub لـ automatic deployments

## استكشاف الأخطاء:

إذا واجهت مشاكل:

1. **Build Failed:**
   - تحقق من Build Logs في Vercel Dashboard
   - تأكد من أن جميع dependencies موجودة في `package.json`

2. **404 Errors:**
   - تأكد من أن `vercel.json` موجود ومضبوط
   - تحقق من rewrites في `vercel.json`

3. **API Errors:**
   - تحقق من Function Logs في Vercel Dashboard
   - تأكد من تهيئة قاعدة البيانات (`/api/init`)

## روابط مفيدة:

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)
