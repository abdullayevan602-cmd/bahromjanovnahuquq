# LAW MASTER UZ ⚖️

Bu platforma huquqshunoslikni noldan boshlab professional darajagacha o'rgatadigan, O'zbekiston huquq tizimiga yo'naltirilgan interaktiv ta'lim platformasi.

## Imkoniyatlar
- 🤖 **AI Yurist**: Huquqiy savollarga oflayn ma'lumotlar bazasi asosida javob beruvchi simulyator.
- 📚 **Huquq Darslari**: 5 bosqichli (Boshlang'ichdan Professionalgacha) darsliklar.
- 📖 **Kodekslar va Qonunlar**: O'zbekiston qonunchiligini oson qidirish va mutolaa qilish.
- 🎙️ **Audio Darslar**: Barcha matnlarni ovozli eshitish imkoniyati (Web Speech API).
- 🧑‍⚖️ **Huquqiy Vaziyatlar (Case-study)**: Real hayotiy holatlarni tahlil qilish.
- 🏛️ **Sud Simulyatori**: Sud jarayonida ishtirok etish mashqlari.
- 📝 **Testlar**: Turli darajadagi bilimni sinash testlari.
- 📊 **Progress & Gamification**: Natijalarni saqlash, ballar va darajalar tizimi (LocalStorage).

## Fayllar Strukturasi
Loyiha hech qanday maxsus server talab qilmaydi, to'liq Frontend texnologiyalariga asoslangan.

```text
law-master-uz/
├── index.html        # Asosiy sahifa va UI strukturasi
├── style.css         # Dizayn va animatsiyalar
├── script.js         # Barcha mantiq va funksiyalar (Vanilla JS)
├── README.md         # Loyiha haqida ma'lumot
└── public/
    └── data/         # Offline JSON ma'lumotlar bazasi
        ├── laws.json
        ├── codes.json
        ├── lessons.json
        ├── tests.json
        └── cases.json
```

## Lokal ishga tushirish
Hech qanday o'rnatish talab etilmaydi! 
Shunchaki `index.html` faylini istalgan zamonaviy veb-brauzerda (Chrome, Firefox, Safari) oching.
(Eslatma: Agar brauzer CORS xatoligi bersa (CORS policy due to fetch API for local files), VS Code da "Live Server" kengaytmasidan foydalanib ishga tushiring).

## GitHub Pages’da ishga tushirish (Bepul va Oson)
1. GitHub hisobingizga kiring (https://github.com).
2. Yangi repository yarating va nomini bering (masalan: `law-master-uz`).
3. Ushbu loyihadagi barcha fayllarni (index.html, style.css, script.js va public papkasini) yuklang.
   *(Eslatma: `data` papkasi to'g'ridan to'g'ri ildizda yoki public papkasida bo'lishidan qat'iy nazar to'g'ri ishlashi uchun `script.js` dagi fetch yo'llariga e'tibor bering).*
4. Repository sahifasida **Settings** -> **Pages** bo'limiga o'ting.
5. **Source** qismidan `main` (yoki `master`) branch'ni tanlab, **Save** tugmasini bosing.
6. Bir necha daqiqadan so'ng GitHub sizga loyihangizning ochiq havolasini taqdim etadi!

## Kelajakda API ulash (AI Yurist uchun)
Hozirgi versiyada AI Yurist lokal ma'lumotlar (`data/`) va kiritilgan qoidalarga asoslanib javob beradi (Mock-up). 
Agar haqiqiy OpenAI yoki Gemini API ulamoqchi bo'lsangiz:
1. Loyihaga backend (Node.js/Express yoki Python/FastAPI) qo'shishingiz kerak bo'ladi.
2. API kalitlarini (API KEYS) **hech qachon** `script.js` yoki `index.html` ichida ochiq yozmang! Bu xavfsizlikka ziddir.
3. Backend orqali API ga so'rov yuboradigan endpoint yarating va Frontenddan o'sha endpointga so'rov yuboring.

## Qonunlar ma'lumotlarini yangilash
Qonunlar va kodekslar o'zgarib turadi. Yangi qonunlarni qo'shish uchun:
1. `public/data/` papkasidagi kerakli JSON faylini oching (masalan, `codes.json`).
2. Yangi obyektni JSON formatida ro'yxatga (Array) qo'shing.
3. Sahifani yangilasangiz, u avtomatik ravishda qidiruv va ro'yxatda paydo bo'ladi.

---
⚠️ **Huquqiy ogohlantirish:** Ushbu platformadagi ma'lumotlar ta'limiy maqsadda beriladi va professional yuridik maslahat o'rnini bosmaydi. Amaldagi qonunchilik o'zgarishi mumkin. Muhim huquqiy masalalarda malakali yurist yoki advokatga murojaat qiling.
