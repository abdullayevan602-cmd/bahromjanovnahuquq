# LEGAL UZ - Huquqiy yordamchi

Professional, zamonaviy va real ishlaydigan O‘zbekiston huquqshunoslik va yuridik yordam ilovasi. 

Ushbu platforma yuridik ma'lumotlarni o'rganish, AI orqali maslahat olish, hujjatlarni avtomatik yaratish va huquqiy testlarni o'z ichiga oladi.

## 🚀 Fayllar tuzilmasi
```text
legal-uz/
├── public/
│   ├── index.html       # Asosiy HTML strukturasi (SPA)
│   ├── style.css        # Tailwind CSS va custom animatsiyalar
│   ├── data.js          # Ma'lumotlar bazasi (Konstitutsiya, lug'at, testlar)
│   ├── app.js           # Frontend mantig'i (Routing, Audio, UI)
│   └── ai.js            # AI Chat va Mikrofon (STT) integratsiyasi
├── server.js            # Express backend (Gemini API uchun proxy)
├── package.json         # Node.js modullari
├── .env.example         # API kalit namunasi
└── README.md            # Yo'riqnoma
```

## ⚙️ O'rnatish bosqichlari (Local)

1. **Repozitoriyani yuklab oling** yoki barcha fayllarni bir xil papkaga joylang.
2. **Kutubxonalarni o'rnating**:
   ```bash
   npm install
   ```
3. **Muhit o'zgaruvchilarini sozlang**:
   Loyihada `.env` faylini yarating va Google AI Studio API kalitingizni kiriting:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. **Serverni ishga tushiring**:
   ```bash
   npm start
   ```
   Brauzerda `http://localhost:3000` manziliga kiring.

## 🔑 Google AI Studio API kalit
API kalit xavfsizligini ta'minlash uchun u `server.js` fayli ichida server tomonida chaqiriladi. Frontend hech qachon kalitni ko'rmaydi, u faqat `/api/chat` orqali server bilan gaplashadi.

## 🌐 GitHub'ga joylash
1. Terminal orqali quyidagi kodlarni ishlating:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <github-repo-url>
git push -u origin main
```

## ☁️ Vercel / Render / Netlify orqali Deploy qilish
**Eslatma:** Ushbu loyihada `server.js` backend qismi bo'lgani uchun uni Vercel kabi Node.js qabul qiluvchi serverlarga qo'yish kerak. 
* **Render.com da**: Yangi "Web Service" ochib GitHub repozitoriyangizni ulang. Start command `node server.js`.
* **Vercel da**: Vercel sozlamalarida "Environment Variables" bo'limiga `GEMINI_API_KEY` ni qo'shing va loyihani deploy qiling. (Agar Vercel da xatolik bersa `vercel.json` qo'shib config qilish kifoya).

## ✅ Funksiyalarni tekshirish:
* **AI Yurist**: Savol yozing yoki mikrofonga gapiring, AI qonuniy javob qaytaradi.
* **Audio**: Konstitutsiya moddalaridagi yoki AI javobidagi "Eshitish" tugmasini bosing.
* **Hujjat Generatori**: "Hujjatlar" bo'limiga o'tib formani to'ldiring va "Nusxa olish" yoki "Yuklash" tugmalarini bosing.
* **Qidiruv**: Tepadagi qidiruvga "mehnat" deb yozib Enter bosing - AI o'sha mavzuda javob izlaydi.
* **Testlar**: "Testlar" bo'limida savollarga javob berib, natijangizni ko'ring.
