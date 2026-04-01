# ⚡ VidGrab — Video Downloader

تطبيق تحميل فيديوهات من منصات التواصل الاجتماعي مبني بـ Next.js.

## المنصات المدعومة
- ▶️ YouTube
- 📷 Instagram
- 🎵 TikTok
- 🐦 Twitter/X
- 📘 Facebook
- 🤖 Reddit
- وأكتر...

## رفع على Vercel

### الطريقة الأولى: GitHub + Vercel (الأسهل)

1. **ارفع المشروع على GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/video-downloader.git
   git push -u origin main
   ```

2. **افتح [vercel.com](https://vercel.com)**

3. **اضغط "Add New Project"**

4. **Import الـ repo من GitHub**

5. **اضغط Deploy** — Vercel هيعمل كل حاجة أوتوماتيك ✅

### الطريقة الثانية: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## تشغيل محلياً

```bash
npm install
npm run dev
```

افتح http://localhost:3000

## كيف يشتغل؟

1. المستخدم يحط رابط الفيديو
2. Next.js API Route بيبعت الرابط لـ [cobalt.tools](https://cobalt.tools) API
3. cobalt API بترجع رابط التحميل المباشر
4. المستخدم يضغط "تحميل" والفيديو ينزل على جهازه

## ملاحظة قانونية
الاستخدام للأغراض الشخصية فقط. احترم حقوق الملكية الفكرية وشروط استخدام كل منصة.
