const db = {
    constitution: [
        { 
            id: 1, 
            num: 1, 
            title: "Davlat suvereniteti",
            text: "O‘zbekiston — boshqaruvning respublika shakliga ega bo‘lgan suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlat.\nDavlatning «O‘zbekiston Respublikasi» va «O‘zbekiston» degan nomlari bir xil ma’noga ega.",
            simple: "O'zbekiston mustaqil davlat. U yerda xalq hokimiyati o'rnatilgan, qonun ustuvor, odamlar farovonligi muhim sanaladi va din davlat ishlariga aralashmaydi.",
            example: "Masalan, hech bir chet el davlati O'zbekistonning ichki ishlariga aralasha olmaydi."
        },
        { 
            id: 2, 
            num: 2, 
            title: "Xalq manfaati",
            text: "Davlat xalq irodasini ifoda etib, uning manfaatlariga xizmat qiladi. Davlat organlari va mansabdor shaxslar jamiyat va fuqarolar oldida mas’uldirlar.",
            simple: "Davlat o'z boshiga emas, xalq nima xohlasa shunga xizmat qiladi. Rahbarlar va davlat idoralari xalq oldida hisob berishga majbur.",
            example: "Hokimlar yoki vazirlar o'z ishlarining natijasi bo'yicha xalq va deputatlar oldida hisobot beradilar."
        },
        { 
            id: 3, 
            num: 7, 
            title: "Xalq hokimiyatchiligi",
            text: "Xalq davlat hokimiyatining birdan bir manbaidir.\nO‘zbekiston Respublikasida davlat hokimiyati xalq manfaatlari ko‘zlanib va O‘zbekiston Respublikasi Konstitutsiyasi hamda uning asosida qabul qilingan qonunlar vakolat bergan idoralar tomonidangina amalga oshiriladi.",
            simple: "Davlatda haqiqiy xo'jayin xalqdir. Hech kim qonundan tashqari hokimiyatni o'zlashtirib ololmaydi.",
            example: "Faqatgina xalq tomonidan saylangan organlar (masalan, Oliy Majlis) qonun qabul qilishi mumkin."
        },
        { 
            id: 4, 
            num: 13, 
            title: "Inson huquqlari va erkinliklari",
            text: "O‘zbekiston Respublikasida demokratiya umuminsoniy prinsiplarga asoslanadi, ularga ko‘ra inson, uning hayoti, erkinligi, sha’ni, qadr-qimmati va boshqa ajralmas huquqlari oliy qadriyat hisoblanadi.",
            simple: "Davlat uchun eng qimmatli narsa — bu inson. Har bir odamning hayoti, erkinligi va hurmati eng yuqori o'rinda turadi.",
            example: "Agar biror qonun inson qadr-qimmatini kamsitsa, u Konstitutsiyaga zid hisoblanadi va bekor qilinishi kerak."
        },
        { 
            id: 5, 
            num: 14, 
            title: "Davlat va inson",
            text: "Davlat o‘z faoliyatini inson va jamiyat farovonligini ko‘zlab, ijtimoiy adolat va qonuniylik prinsiplari asosida amalga oshiradi.",
            simple: "Davlatning asosiy vazifasi odamlarning yaxshi yashashini ta'minlashdir.",
            example: "Davlat tomonidan kam ta'minlangan oilalarga nafaqa ajratilishi, bepul ta'lim va tibbiyot ta'minlanishi shunga misol."
        },
        { 
            id: 6, 
            num: 15, 
            title: "Konstitutsiya ustuvorligi",
            text: "O‘zbekiston Respublikasida O‘zbekiston Respublikasi Konstitutsiyasi va qonunlarining ustunligi so‘zsiz tan olinadi.\nO‘zbekiston Respublikasi Konstitutsiyasi butun mamlakat hududida oliy yuridik kuchga, to‘g‘ridan-to‘g‘ri amal qilishga ega va yagona huquqiy makonning asosi hisoblanadi.",
            simple: "Konstitutsiya barcha qonunlardan ustun turadi va to'g'ridan-to'g'ri ishlaydi.",
            example: "Agar mahalliy hokim qarori Konstitutsiyaga zid bo'lsa, fuqaro to'g'ridan-to'g'ri sudga Konstitutsiyani ro'kach qilib murojaat qilishi mumkin."
        },
        { 
            id: 7, 
            num: 25, 
            title: "Yashash huquqi",
            text: "Yashash huquqi har bir insonning uzviy huquqidir. Inson hayotiga suiqasd qilish eng og‘ir jinoyatdir.\nO‘zbekiston Respublikasida o‘lim jazosi taqiqlanadi.",
            simple: "Har bir inson yashashga haqli, davlat o'lim jazosini bekor qilgan.",
            example: "Hech qanday jinoyat uchun O'zbekistonda o'lim jazosi berilmaydi, eng og'ir jazo umrbod ozodlikdan mahrum qilishdir."
        },
        { 
            id: 8, 
            num: 27, 
            title: "Erkinlik va shaxsiy daxlsizlik",
            text: "Har kim erkinlik va shaxsiy daxlsizlik huquqiga ega.\nHibsga olishga, qamoqqa olishga va qamoqda saqlashga faqat sudning qaroriga ko‘ra yo‘l qo‘yiladi. Shaxs sudning qarorisiz qirq sakkiz soatdan ortiq muddat ushlab turilishi mumkin emas.",
            simple: "Odamni faqat sud hukmi bilan qamash mumkin, politsiya sudsiz 48 soatdan ortiq ushlab turolmaydi.",
            example: "Agar shaxs gumonlanuvchi sifatida ushlansa, unga 48 soat ichida ayblov e'lon qilinib, sudga olib borilishi kerak."
        },
        { 
            id: 9, 
            num: 28, 
            title: "Ayblov va himoya",
            text: "Jinoyat sodir etganlikda ayblanayotgan shaxs uning aybi qonunda nazarda tutilgan tartibda oshkora sud muhokamasi yo‘li bilan isbotlanmagunicha va sudning qonuniy kuchga kirgan hukmi bilan aniqlanmagunicha aybsiz hisoblanadi (aybsizlik prezumpsiyasi).",
            simple: "Sudning hukmi chiqmaguncha hech kim jinoyatchi hisoblanmaydi.",
            example: "OAV yoki tergovchi shaxsni hali sud hukmisiz 'jinoyatchi' deb atashga haqli emas."
        },
        { 
            id: 10, 
            num: 29, 
            title: "Huquqiy himoya",
            text: "Har kimga o‘z huquq va erkinliklarini sud orqali himoya qilish, davlat organlarining hamda boshqa tashkilotlarning, ular mansabdor shaxslarining qonunga xilof qarorlari, harakatlari va harakatsizligi ustidan sudga shikoyat qilish huquqi kafolatlanadi.",
            simple: "Agar huquqingiz buzilsa, sudga murojaat qilish huquqingiz bor. Hech bir amaldor sud ustidan hukmron emas.",
            example: "Hokimiyat yoki politsiya xodimi noqonuniy jarima yozsa, siz to'g'ridan-to'g'ri sudga borib bu qarorni bekor qildirishingiz mumkin."
        },
        { 
            id: 11, 
            num: 31, 
            title: "Xususiy hayot daxlsizligi",
            text: "Har kim shaxsiy hayotining daxlsizligi, shaxsiy va oilaviy siri, o‘z sha’ni va qadr-qimmati himoya qilinishi huquqiga ega.",
            simple: "Hech kim sizning shaxsiy hayotingizga aralashishga haqli emas.",
            example: "Telefon so'zlashuvlarini eshitish yoki shaxsiy xatlarni o'qish faqat sud ruxsati bilan tergov uchun qilinishi mumkin."
        },
        { 
            id: 12, 
            num: 37, 
            title: "So'z va e'tiqod erkinligi",
            text: "Har kim fikrlash, so‘z va e’tiqod erkinligi huquqiga ega. Har kim o‘zi istagan axborotni izlash, olish va tarqatish huquqiga ega, davlat siri va boshqa sirga taalluqli ma’lumotlar bundan mustasno.",
            simple: "Siz o'z fikringizni bildirishga va ma'lumot izlashga haqlisiz (davlat sirlaridan tashqari).",
            example: "Jurnalistlar yoki blogerlar qonun doirasida erkin izlanish olib borishlari va maqola yozishlari mumkin."
        }
    ],
    codes: [
        { id: 'civil', title: 'Fuqarolik huquqi', desc: 'Shartnomalar, mulk huquqi, zararni qoplash, meros masalalari. Xususiy huquqiy munosabatlarni tartibga soladi.', icon: 'fa-handshake' },
        { id: 'criminal', title: 'Jinoyat huquqi', desc: 'Jinoyatlar turlari, jinoiy javobgarlik, jazolar va ularni qo\'llash tartibi.', icon: 'fa-gavel' },
        { id: 'labor', title: 'Mehnat huquqi', desc: 'Ishga qabul qilish, ishdan bo\'shatish, mehnat shartnomalari, ta\'til, oylik maosh va mehnat nizolari.', icon: 'fa-briefcase' },
        { id: 'family', title: 'Oila huquqi', desc: 'Nikoh tuzish va bekor qilish, aliment, ota-ona va bola huquqlari, mulk bo\'linishi.', icon: 'fa-users' },
        { id: 'admin', title: 'Ma\'muriy huquq', desc: 'Ma\'muriy qoidabuzarliklar (Yo\'l harakati, jamoat tartibi), jarimalar va ularni undirish tartibi.', icon: 'fa-file-invoice' },
        { id: 'business', title: 'Tadbirkorlik huquqi', desc: 'Biznesni ro\'yxatdan o\'tkazish, tadbirkorlar huquqlari, tekshiruvlar, litsenziyalar, soliq munosabatlari.', icon: 'fa-building' },
        { id: 'tax', title: 'Soliq huquqi', desc: 'Soliq turlari, soliq majburiyatlari, soliq imtiyozlari va hisobot topshirish tartibi.', icon: 'fa-coins' },
        { id: 'housing', title: 'Uy-joy huquqi', desc: 'Uy-joy oldi-sotdisi, ijarasi, propiska va kommunal masalalar.', icon: 'fa-home' },
        { id: 'eco', title: 'Ekologiya huquqi', desc: 'Atrof-muhitni muhofaza qilish, daraxtlarni kesishga qo\'yilgan taqiqlar, tabiatga yetkazilgan zararlar.', icon: 'fa-leaf' },
        { id: 'it', title: 'IT va Kiberhuquq', desc: 'Axborot texnologiyalari, elektron tijorat, kiberxavfsizlik va ma\'lumotlarni himoya qilish.', icon: 'fa-laptop-code' }
    ],
    dictionary: [
        { term: "Advokat", desc: "Huquqiy yordam ko‘rsatuvchi, sud va boshqa organlarda fuqarolar yoki tashkilotlar manfaatlarini himoya qiluvchi, maxsus litsenziyaga ega malakali huquqshunos." },
        { term: "Aliment", desc: "Qonunga muvofiq, oilaning voyaga yetmagan, mehnatga layoqatsiz yoki muhtoj a'zolarini ta'minlash uchun sud qarori yoki kelishuv asosida to'lanadigan mablag'." },
        { term: "Apellyatsiya", desc: "Qonuniy kuchga kirmagan sud qarori ustidan yuqori instansiya sudiga beriladigan shikoyat, ishni qayta ko'rib chiqish." },
        { term: "Ayblanuvchi", desc: "Unga nisbatan jinoyat sodir etganligi to'g'risida yetarli dalillar bo'lgan va ayblanuvchi tariqasida ishda ishtirok etishga jalb qilingan shaxs." },
        { term: "Dalil", desc: "Ish bo'yicha haqiqatni aniqlash uchun ahamiyatga ega bo'lgan, qonunda belgilangan tartibda olingan har qanday faktik ma'lumotlar, ashyolar, ko'rsatmalar." },
        { term: "Da'vogar", desc: "O‘zining buzilgan yoxud nizolashilayotgan huquqlari yoki qonun bilan qo‘riqlanadigan manfaatlarini himoya qilishni so‘rab Fuqarolik, Iqtisodiy yoki Ma'muriy sudga murojaat qilgan shaxs." },
        { term: "Ehtiyot chorasi", desc: "Ayblanuvchi (gumon qilinuvchi) sud tergovidan qochib ketmasligi yoki yangi jinoyat sodir etmasligi uchun qo'llaniladigan majburlov (masalan, qamoqqa olish, tilxat)." },
        { term: "Fors-major", desc: "Shartnoma majburiyatlarini bajarishga to'sqinlik qiluvchi, oldindan ko'rib bo'lmaydigan va oldini olib bo'lmaydigan favqulodda vaziyat (masalan, zilzila, urush)." },
        { term: "Guvoh", desc: "Ish uchun ahamiyatga ega bo'lgan biror bir holatni biladigan va ko'rsatma berish uchun sudga yoki tergovga chaqirilgan shaxs." },
        { term: "Jabrlanuvchi", desc: "Jinoyat yoki ma'muriy huquqbuzarlik oqibatida jismoniy, mulkiy yoki ma'naviy zarar ko'rgan shaxs." },
        { term: "Jarima", desc: "Qonunbuzarlik uchun davlat foydasiga yoki shartnoma majburiyatini buzganlik uchun ikkinchi tomon foydasiga undiriladigan pul undiruvi." },
        { term: "Javobgar", desc: "Da'vogar tomonidan huquqbuzarlikda yoki huquqni tan olmaslikda ayblanib, sudga javob berish uchun jalb qilingan shaxs yoki tashkilot." },
        { term: "Kassatsiya", desc: "Qonuniy kuchga kirgan sud qarori ustidan qonun buzilganligi sababli (faktlarni qayta ko'rmasdan) beriladigan shikoyat." },
        { term: "Meros", desc: "Vafot etgan shaxsning (meros qoldiruvchining) mol-mulki, huquq va majburiyatlarining uning vorislariga (farzandlari, yaqinlari) o'tishi." },
        { term: "Notarius", desc: "Huquqiy hujjatlarni tasdiqlaydigan, ishonchnomalar beradigan va bitimlarni qonuniylashtiradigan maxsus vakolatli shaxs." },
        { term: "Prokuror", desc: "Qonunlarning ijro etilishi ustidan davlat nazoratini amalga oshiruvchi va sudda davlat ayblovini qo'llab-quvvatlovchi mansabdor shaxs." },
        { term: "Sud", desc: "Davlat nomidan odil sudlovni amalga oshiruvchi, jinoyat, fuqarolik, ma'muriy va iqtisodiy ishlarni ko'rib chiquvchi yagona organ." },
        { term: "Shartnoma", desc: "Ikki yoki undan ortiq shaxslarning fuqarolik huquq va majburiyatlarini belgilash, o'zgartirish yoki bekor qilish to'g'risidagi kelishuvi." }
    ],
    tests: [
        {
            q: "O'zbekiston Respublikasida davlat hokimiyatining birdan bir manbai kim?",
            opts: ["A) O'zbekiston Respublikasi Prezidenti", "B) Oliy Majlis", "C) Xalq", "D) Konstitutsiyaviy sud"],
            ans: 2,
            exp: "Konstitutsiyaning 7-moddasiga asosan: Xalq davlat hokimiyatining birdan bir manbaidir."
        },
        {
            q: "Mehnat shartnomasi qanday shaklda tuziladi?",
            opts: ["A) Faqat yozma shaklda", "B) Yozma yoki og'zaki shaklda", "C) Elektron shaklda", "D) Notarial tasdiqlangan shaklda"],
            ans: 0,
            exp: "Mehnat kodeksiga muvofiq, mehnat shartnomasi yozma shaklda tuzilishi shart."
        },
        {
            q: "Aybsizlik prezumpsiyasi qanday ma'noni bildiradi?",
            opts: ["A) Har qanday shaxs jinoyat qilishga qodir emas", "B) Ayb sud hukmi bilan isbotlanmagunicha shaxs aybsiz hisoblanadi", "C) Tergovchi aybdor deb topsa shaxs aybdor hisoblanadi", "D) Gumon qilinuvchi o'zini oqlashga majbur"],
            ans: 1,
            exp: "Konstitutsiya 28-moddasi: Ayb sudning qonuniy kuchga kirgan hukmi bilan isbotlanmaguncha shaxs aybsiz hisoblanadi (Aybsizlik prezumpsiyasi)."
        },
        {
            q: "Voyaga yetmagan bola uchun aliment miqdori bitta bola uchun qancha?",
            opts: ["A) Oylik daromadning 1/2 qismi", "B) Oylik daromadning 1/3 qismi", "C) Oylik daromadning 1/4 qismi", "D) Eng kam ish haqining 50 foizi"],
            ans: 2,
            exp: "Oila kodeksi 99-moddasi: Aliment 1 bola uchun daromadning chorak (1/4) qismi, 2 bola uchun uchdan bir (1/3) qismi miqdorida undiriladi."
        },
        {
            q: "Da'vo arizasi qaysi organga topshiriladi?",
            opts: ["A) Prokuraturaga", "B) Ichki ishlar bo'limiga", "C) Sudga", "D) Adliya vazirligiga"],
            ans: 2,
            exp: "Da'vo arizasi (fuqarolik va iqtisodiy nizolar bo'yicha) sudga taqdim etiladi."
        },
        {
            q: "Qaysi jazoni O'zbekistonda qo'llash taqiqlangan?",
            opts: ["A) Umrbod ozodlikdan mahrum qilish", "B) O'lim jazosi", "C) Mol-mulkni musodara qilish", "D) Uy qamog'i"],
            ans: 1,
            exp: "Konstitutsiya 25-modda: O'zbekiston Respublikasida o'lim jazosi taqiqlanadi."
        }
    ],
    docs: [
        {
            id: 'ariza_ish_kirish', 
            name: "Ishga qabul qilish arizasi",
            fields: [
                { id: 'rahbar', label: "Kompaniya rahbari (F.I.O yoki lavozimi)" },
                { id: 'tashkilot', label: "Tashkilot nomi" },
                { id: 'fuqaro', label: "Arizachi F.I.O" },
                { id: 'lavozim', label: "Qaysi lavozimga" }
            ],
            render: (d) => `                                      ${d.tashkilot} rahbari
                                      ${d.rahbar} ga
                                      ${d.fuqaro} dan

                                  A R I Z A

    Men, ${d.fuqaro}, o'z xohishimga ko'ra meni tashkilotingizga ${d.lavozim} lavozimiga ishga qabul qilishingizni so'rayman.

    Tegishli hujjatlarni (obyektivka, pasport nusxasi, diplom nusxasi) ilova qilaman.

    Sana: ${new Date().toLocaleDateString()}
    Imzo: _________________`
        },
        {
            id: 'ariza_ish_boshash', 
            name: "Ishdan bo'shash arizasi (o'z xohishiga ko'ra)",
            fields: [
                { id: 'rahbar', label: "Kompaniya rahbari (F.I.O yoki lavozimi)" },
                { id: 'fuqaro', label: "Sizning F.I.O" },
                { id: 'lavozim', label: "Sizning lavozimingiz" }
            ],
            render: (d) => `                                      Tashkilot rahbari
                                      ${d.rahbar} ga
                                      ${d.lavozim}
                                      ${d.fuqaro} dan

                                  A R I Z A

    Meni O'zbekiston Respublikasi Mehnat Kodeksining tegishli moddasiga asosan o'z xohishimga ko'ra (tomonlar kelishuvi bilan) vazifamdan ozod qilishingizni so'rayman.

    Sana: ${new Date().toLocaleDateString()}
    Imzo: _________________`
        },
        {
            id: 'shikoyat_daavo', 
            name: "Sudga murojaat (Da'vo arizasi - Qarz undirish)",
            fields: [
                { id: 'sud', label: "Qaysi Fuqarolik sudi (Masalan: Chilonzor tumani fuqarolik ishlari bo'yicha sudi)" },
                { id: 'daavogar', label: "Da'vogar (F.I.O, yashash manzili, tel)" },
                { id: 'javobgar', label: "Javobgar (F.I.O, yashash manzili, tel)" },
                { id: 'qarz', label: "Qarz summasi (Raqam bilan)" },
                { id: 'mazmun', label: "Da'vo asosi (Qisqacha qachon va nega qarz berilgan)", type: "textarea" }
            ],
            render: (d) => `                                      ${d.sud} ga
                                      
                                      Da'vogar: ${d.daavogar}
                                      Javobgar: ${d.javobgar}

                                  DA'VO ARIZASI
                               (Qarz summasini undirish to'g'risida)

    Javobgar ${d.javobgar} mendan quyidagi holatlarda qarz olgan:
    ${d.mazmun}

    Javobgar shu kunga qadar o'z ixtiyori bilan qarz summasini qaytarmay kelmoqda. O'zbekiston Respublikasi Fuqarolik kodeksining 327, 732, 733-moddalariga asosan:

    S O' R A Y M A N :
    
    1. Javobgar ${d.javobgar} dan mening foydamga ${d.qarz} so'm qarz summasini undirib berishingizni.
    2. To'langan davlat bojini javobgar zimmasiga yuklashingizni.

    Ilova qilinadigan hujjatlar:
    1. Pasport nusxalari
    2. Tilxat yoki shartnoma nusxasi
    3. Davlat boji to'langanligi kvitansiyasi

    Da'vogar imzosi: _________________
    Sana: ${new Date().toLocaleDateString()}`
        },
        {
            id: 'tilxat', 
            name: "Qarz oldi-berdi Tilxati",
            fields: [
                { id: 'oluvchi', label: "Qarz oluvchi F.I.O, Pasport, Manzil" },
                { id: 'beruvchi', label: "Qarz beruvchi F.I.O" },
                { id: 'summa', label: "Qarz summasi (so'm yoki $)" },
                { id: 'muddat', label: "Qaytarish muddati (sana)" }
            ],
            render: (d) => `                                      T I L X A T

    Men, ${d.oluvchi}, fuqaro ${d.beruvchi} dan jami ${d.summa} miqdorida qarz oldim.

    Ushbu qarzni to'liq holda ${d.muddat} sanasigacha qaytarib berishni o'z zimmamga olaman. 
    Agar o'z vaqtida qaytara olmasam, O'zbekiston Respublikasi qonunchiligida belgilangan tartibda (jumladan sud orqali undirilishiga, xarajatlar va penyalarga) javobgar bo'lishga roziman.

    Tilxat mening o'z qo'lim bilan, hech qanday tazyiqsiz, sog'lom aql bilan yozildi.

    Qarz Oluvchi Imzosi: _________________
    Sana: ${new Date().toLocaleDateString()}`
        },
        {
            id: 'ishonchnoma_avto', 
            name: "Avtomobil boshqarish Ishonchnomasi (Namuna)",
            fields: [
                { id: 'egasi', label: "Avtomobil egasi (F.I.O, Pasport)" },
                { id: 'ishonchli_shaxs', label: "Ishonchli shaxs (F.I.O, Pasport)" },
                { id: 'avto_rusum', label: "Avtomobil rusumi va Davlat raqami" }
            ],
            render: (d) => `                                  I S H O N C H N O M A

    (ESLATMA: Transport vositasini boshqarish uchun ishonchnoma notarial tartibda tasdiqlanishi yoki elektron shaklda E-notarius orqali rasmiylashtirilishi shart. Bu faqat qoralama matndir.)

    Men, ${d.egasi}, o'zimga tegishli bo'lgan ${d.avto_rusum} rusumli avtotransport vositasini boshqarish, undan foydalanish, texnik ko'rikdan o'tkazish, sug'urta polislarini rasmiylashtirish huquqini 
    fuqaro ${d.ishonchli_shaxs} ga ishonib topshiraman.

    Ushbu ishonchnoma 3 yil muddatga berildi. Boshqa shaxsga o'tkazish (pere-doverennost) huquqisiz.

    Ishonch bildiurvchi imzosi: _________________
    Sana: ${new Date().toLocaleDateString()}`
        }
    ]
};
