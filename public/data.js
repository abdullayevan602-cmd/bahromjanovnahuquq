const legalData = {
    constitution: [
        { 
            id: 1, 
            number: 1, 
            title: "Davlat suvereniteti",
            text: "O‘zbekiston — boshqaruvning respublika shakliga ega bo‘lgan suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlat.\nDavlatning «O‘zbekiston Respublikasi» va «O‘zbekiston» degan nomlari bir xil ma’noga ega.",
            simple_text: "O'zbekiston mustaqil davlat. U yerda xalq hokimiyati o'rnatilgan, qonun ustuvor, odamlar farovonligi muhim sanaladi va din davlat ishlariga aralashmaydi.",
            example: "Masalan, hech bir chet el davlati O'zbekistonning ichki ishlariga aralasha olmaydi. Fuqarolar o'z rahbarlarini saylov orqali tanlaydilar."
        },
        { 
            id: 2, 
            number: 13, 
            title: "Inson huquqlari va erkinliklari",
            text: "O‘zbekiston Respublikasida demokratiya umuminsoniy prinsiplarga asoslanadi, ularga ko‘ra inson, uning hayoti, erkinligi, sha’ni, qadr-qimmati va boshqa ajralmas huquqlari oliy qadriyat hisoblanadi.",
            simple_text: "Davlat uchun eng qimmatli narsa — bu inson. Har bir odamning hayoti, erkinligi va hurmati eng yuqori o'rinda turadi.",
            example: "Agar biror qonun inson qadr-qimmatini kamsitsa, u Konstitutsiyaga zid hisoblanadi va bekor qilinishi kerak."
        },
        { 
            id: 3, 
            number: 29, 
            title: "Huquqiy himoya",
            text: "Har kimga o‘z huquq va erkinliklarini sud orqali himoya qilish, davlat organlarining hamda boshqa tashkilotlarning, ular mansabdor shaxslarining qonunga xilof qarorlari, harakatlari va harakatsizligi ustidan sudga shikoyat qilish huquqi kafolatlanadi.",
            simple_text: "Agar huquqingiz buzilsa, sudga murojaat qilish huquqingiz bor. Hech bir amaldor sud ustidan hukmron emas.",
            example: "Hokimiyat yoki politsiya xodimi noqonuniy jarima yozsa, siz to'g'ridan-to'g'ri sudga borib bu qarorni bekor qildirishingiz mumkin."
        }
    ],
    codes: [
        { id: 'civil', title: 'Fuqarolik huquqi', desc: 'Shartnomalar, mulk, zarar qoplash, meros', icon: 'fa-handshake' },
        { id: 'criminal', title: 'Jinoyat huquqi', desc: 'Jinoyatlar va jazolar, javobgarlik', icon: 'fa-gavel' },
        { id: 'labor', title: 'Mehnat huquqi', desc: 'Ishga kirish, bo\'shatish, ta\'til, oylik', icon: 'fa-briefcase' },
        { id: 'family', title: 'Oila huquqi', desc: 'Nikoh, ajrashish, aliment, bola huquqi', icon: 'fa-users' },
        { id: 'admin', title: 'Ma\'muriy huquq', desc: 'Qoidabuzarliklar, jarimalar, MTHJ', icon: 'fa-file-invoice' },
        { id: 'business', title: 'Tadbirkorlik huquqi', desc: 'Biznes ochish, soliqlar, litsenziyalar', icon: 'fa-building' }
    ],
    dictionary: [
        { term: "Advokat", desc: "Huquqiy yordam ko‘rsatuvchi, sud va boshqa organlarda fuqarolar yoki tashkilotlar manfaatlarini himoya qiluvchi malakali huquqshunos." },
        { term: "Aliment", desc: "Qonunga muvofiq, oilaning voyaga yetmagan, mehnatga layoqatsiz yoki muhtoj a'zolarini ta'minlash uchun to'lanadigan mablag'." },
        { term: "Apellyatsiya", desc: "Qonuniy kuchga kirmagan sud qarori ustidan yuqori instansiya sudiga beriladigan shikoyat." },
        { term: "Da'vogar", desc: "O‘zining buzilgan yoxud nizolashilayotgan huquqlari yoki qonun bilan qo‘riqlanadigan manfaatlarini himoya qilishni so‘rab sudga murojaat qilgan shaxs." },
        { term: "Javobgar", desc: "Da'vogar tomonidan huquqbuzarlikda yoki huquqni tan olmaslikda ayblanib, sudga jalb qilingan shaxs." },
        { term: "Meros", desc: "Vafot etgan shaxsning (meros qoldiruvchining) mol-mulki, huquq va majburiyatlarining uning vorislariga o'tishi." }
    ],
    tests: [
        {
            question: "O'zbekiston Respublikasida davlat hokimiyatining birdan bir manbai kim?",
            options: ["A) O'zbekiston Respublikasi Prezidenti", "B) Oliy Majlis", "C) Xalq", "D) Konstitutsiyaviy sud"],
            answer: 2,
            explanation: "Konstitutsiyaning 7-moddasiga asosan: Xalq davlat hokimiyatining birdan bir manbaidir."
        },
        {
            question: "Mehnat shartnomasi qanday shaklda tuziladi?",
            options: ["A) Faqat yozma shaklda", "B) Yozma yoki og'zaki shaklda", "C) Elektron shaklda", "D) Notarial tasdiqlangan shaklda"],
            answer: 0,
            explanation: "Mehnat kodeksiga muvofiq mehnat shartnomasi yozma shaklda tuzilishi shart."
        }
    ],
    templates: [
        {
            id: 'ariza',
            name: 'Umumiy Ariza',
            fields: [
                { id: 'to', label: 'Tashkilot nomi va rahbar F.I.O', placeholder: 'Toshkent shahar MIB boshlig\'iga' },
                { id: 'from', label: 'Arizachi F.I.O va manzili', placeholder: 'Fuqaro A.Valiyevdan, Chilonzor tumani...' },
                { id: 'body', label: 'Ariza mazmuni (muammoni yozing)', type: 'textarea' }
            ],
            render: (d) => `                                      ${d.to}ga
                                      ${d.from}dan

                                  A R I Z A

    Men, ${d.from}, shuni ma'lum qilamanki:
    ${d.body}

    Yuqoridagilarni inobatga olib, qonuniy chora ko'rishingizni so'rayman.

    Sana: ${new Date().toLocaleDateString()}
    Imzo: _________________`
        },
        {
            id: 'shikoyat',
            name: 'Shikoyat (Ustidan arz qilish)',
            fields: [
                { id: 'to', label: 'Kiritilayotgan idora', placeholder: 'Prokuraturaga' },
                { id: 'from', label: 'Shikoyatchi ma\'lumotlari', placeholder: 'F.I.O, telefon raqam, manzil' },
                { id: 'against', label: 'Kimning ustidan shikoyat?', placeholder: 'F.I.O yoki tashkilot nomi' },
                { id: 'body', label: 'Shikoyat mazmuni va asoslar', type: 'textarea' }
            ],
            render: (d) => `                                      ${d.to}ga
                                      ${d.from}dan

                                  S H I K O Y A T
                         ( ${d.against} ning noqonuniy harakatlari ustidan )

    ${d.body}

    Iltimos, ushbu holat yuzasidan tekshiruv o'tkazib, qonunbuzilish holatini bartaraf etishingizni so'rayman.

    Sana: ${new Date().toLocaleDateString()}
    Imzo: _________________`
        }
    ]
};
