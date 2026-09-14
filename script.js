// --- FALLBACK DATA (Ensures it works perfectly without server/fetch) ---
const FALLBACK_DATA = {
    lessons: [
        { id: "l1", level: "Boshlang'ich", title: "Huquq nima?", simple_explanation: "Huquq — bu jamiyat qoidalari.", audio_text: "Huquq — bu jamiyatda odamlar qanday yashashini belgilab beruvchi qoidalar to'plami." },
        { id: "l2", level: "O'rta", title: "Shartnoma tushunchasi", simple_explanation: "Shartnoma - kelishuv.", audio_text: "Shartnoma ikki yoki undan ortiq shaxsning kelishuvi hisoblanadi." }
    ],
    codes: [
        {
            title: "Mehnat Kodeksi",
            sections: [
                {
                    title: "I Bo'lim. Umumiy Qoidalar",
                    articles: [
                        { number: "1-modda", title: "Maqsadi", text: "Mehnat to'g'risidagi qonunchilikning maqsadi... ishchi va ish beruvchi munosabatlarini tartibga solish.", explanation: "Mehnat qoidalari adolat o'rnatish uchun." }
                    ]
                }
            ]
        }
    ],
    cases: [
        {
            title: "Mehnat nizosi: Maosh bermaslik",
            scenario: "Xodim 3 oy ishladi, mehnat shartnomasi yo'q, oylik berilmadi.",
            questions: [{ q: "Muammo nimada?", options: ["Soliq", "Maosh berilmaganligi", "Vaqt"], correct: 1 }],
            explanation: "Shartnoma tuzilmagan bo'lsa ham xodim ishlaganini isbotlasa sud orqali undirishi mumkin."
        }
    ],
    tests: [
        { question: "Asosiy qonun qanday ataladi?", options: ["Kodeks", "Konstitutsiya", "Farmon"], correct_index: 1 }
    ]
};

// --- TRANSLATIONS ---
const I18N = {
    uz: {
        home_title: "Huquqni O'rganishni Boshlang", home_desc: "Noldan professional darajagacha huquqshunoslik.", btn_start: "Boshlash",
        nav_home: "Bosh Sahifa", nav_ai: "AI Yurist", nav_lessons: "Huquq Darslari", nav_codes: "Kodekslar",
        nav_cases: "Vaziyatlar (Study)", nav_usercases: "Mening ishlarim", nav_docgen: "Hujjat Generatori", 
        nav_contract: "Shartnoma Tahlili", nav_tests: "Testlar", nav_progress: "Natijalar",
        ai_welcome: "Assalomu alaykum! Men sizning yordamchi AI yuristingizman. Savolingizni bering.",
        search_placeholder: "Qonun, modda qidirish...", ai_placeholder: "Savolingizni yozing..."
    },
    ru: {
        home_title: "Начните изучать право", home_desc: "От нуля до профессионального уровня.", btn_start: "Начать",
        nav_home: "Главная", nav_ai: "ИИ Юрист", nav_lessons: "Уроки права", nav_codes: "Кодексы",
        nav_cases: "Ситуации (Study)", nav_usercases: "Мои дела", nav_docgen: "Генератор док.", 
        nav_contract: "Анализ договора", nav_tests: "Тесты", nav_progress: "Результаты",
        ai_welcome: "Здравствуйте! Я ваш ИИ юрист. Задайте свой вопрос.",
        search_placeholder: "Поиск законов, статей...", ai_placeholder: "Напишите ваш вопрос..."
    },
    en: {
        home_title: "Start Learning Law", home_desc: "From scratch to professional level.", btn_start: "Start",
        nav_home: "Home", nav_ai: "AI Lawyer", nav_lessons: "Law Lessons", nav_codes: "Codes",
        nav_cases: "Study Cases", nav_usercases: "My Cases", nav_docgen: "Doc Generator", 
        nav_contract: "Contract Review", nav_tests: "Tests", nav_progress: "Progress",
        ai_welcome: "Hello! I am your AI assistant lawyer. Ask me a question.",
        search_placeholder: "Search laws, articles...", ai_placeholder: "Type your question..."
    }
};

const NAV_ITEMS = [
    { id: 'home', icon: 'fa-house', key: 'nav_home' },
    { id: 'ai', icon: 'fa-robot', key: 'nav_ai' },
    { id: 'lessons', icon: 'fa-book', key: 'nav_lessons' },
    { id: 'codes', icon: 'fa-scale-unbalanced', key: 'nav_codes' },
    { id: 'studycases', icon: 'fa-graduation-cap', key: 'nav_cases' },
    { id: 'usercases', icon: 'fa-briefcase', key: 'nav_usercases' },
    { id: 'docgen', icon: 'fa-file-contract', key: 'nav_docgen' },
    { id: 'contractreview', icon: 'fa-magnifying-glass', key: 'nav_contract' },
    { id: 'tests', icon: 'fa-list-check', key: 'nav_tests' },
    { id: 'progress', icon: 'fa-chart-pie', key: 'nav_progress' }
];

// --- APP CORE LOGIC ---
window.app = {
    state: {
        currentTab: 'home',
        data: FALLBACK_DATA, // Use fallback directly to guarantee it works. (Local fetch often fails on file://)
        progress: { score: 0, level: 'Boshlang\'ich', completed: [] },
        userCases: [],
        settings: { theme: 'light', lang: 'uz', speed: 1 },
        audio: { synth: window.speechSynthesis, utterance: null, isPlaying: false, text: '' }
    },

    init: function() {
        this.loadStorage();
        this.setupTheme();
        this.applyLanguage();
        this.renderNav();
        this.bindEvents();
        this.renderAll();
        this.setupSpeechToText();
    },

    loadStorage: function() {
        try {
            const p = localStorage.getItem('lm_progress');
            if(p) this.state.progress = JSON.parse(p);
            
            const u = localStorage.getItem('lm_usercases');
            if(u) this.state.userCases = JSON.parse(u);
            
            const s = localStorage.getItem('lm_settings');
            if(s) {
                this.state.settings = JSON.parse(s);
                document.getElementById('lang-select').value = this.state.settings.lang;
            }
        } catch(e) { console.error("Storage load error", e); }
    },

    saveStorage: function() {
        localStorage.setItem('lm_progress', JSON.stringify(this.state.progress));
        localStorage.setItem('lm_usercases', JSON.stringify(this.state.userCases));
        localStorage.setItem('lm_settings', JSON.stringify(this.state.settings));
    },

    setupTheme: function() {
        if(this.state.settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.getElementById('theme-toggle').innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            document.documentElement.classList.remove('dark');
            document.getElementById('theme-toggle').innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    },

    applyLanguage: function() {
        const lang = this.state.settings.lang;
        const dict = I18N[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = dict[el.getAttribute('data-i18n')] || el.textContent;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = dict[el.getAttribute('data-i18n-placeholder')] || el.placeholder;
        });
        this.renderNav(); // Re-render nav with new lang
    },

    renderNav: function() {
        const dNav = document.getElementById('desktop-nav');
        const mNav = document.getElementById('mobile-nav-list');
        dNav.innerHTML = ''; mNav.innerHTML = '';
        const lang = this.state.settings.lang;

        NAV_ITEMS.forEach(item => {
            const label = I18N[lang][item.key];
            const activeCls = this.state.currentTab === item.id ? 'bg-blue-50 text-primary dark:bg-slate-700 border-r-4 border-primary' : '';
            
            const btnHtml = `<button onclick="app.switchTab('${item.id}')" class="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 font-medium ${activeCls}"><i class="fa-solid ${item.icon} w-5 text-center"></i> ${label}</button>`;
            
            dNav.innerHTML += btnHtml;
            mNav.innerHTML += btnHtml;
        });
    },

    switchTab: function(tabId) {
        this.stopAudio();
        this.state.currentTab = tabId;
        
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(`view-${tabId}`);
        if(target) target.classList.add('active');
        
        this.renderNav();
        document.getElementById('mobile-menu').classList.add('translate-x-full');
        document.getElementById('mobile-menu-overlay').classList.add('hidden');
        document.getElementById('content-area').scrollTop = 0;
    },

    bindEvents: function() {
        document.getElementById('theme-toggle').onclick = () => {
            this.state.settings.theme = this.state.settings.theme === 'light' ? 'dark' : 'light';
            this.saveStorage();
            this.setupTheme();
        };

        document.getElementById('lang-select').onchange = (e) => {
            this.state.settings.lang = e.target.value;
            this.saveStorage();
            this.applyLanguage();
        };

        // Mobile Menu
        document.getElementById('mobile-menu-btn').onclick = () => {
            document.getElementById('mobile-menu').classList.remove('translate-x-full');
            document.getElementById('mobile-menu-overlay').classList.remove('hidden');
        };
        const closeMenu = () => {
            document.getElementById('mobile-menu').classList.add('translate-x-full');
            document.getElementById('mobile-menu-overlay').classList.add('hidden');
        };
        document.getElementById('mobile-menu-close').onclick = closeMenu;
        document.getElementById('mobile-menu-overlay').onclick = closeMenu;

        // Audio controls
        document.getElementById('audio-play').onclick = () => this.playAudio();
        document.getElementById('audio-pause').onclick = () => this.pauseAudio();
        document.getElementById('audio-stop').onclick = () => this.stopAudio();
        document.getElementById('audio-close').onclick = () => {
            this.stopAudio();
            document.getElementById('audio-player').classList.add('translate-y-32');
        };
        document.getElementById('audio-speed').onchange = (e) => {
            this.state.settings.speed = parseFloat(e.target.value);
            this.saveStorage();
        };

        // AI Chat
        const aiIn = document.getElementById('ai-input');
        const aiBtn = document.getElementById('ai-send-btn');
        const handleSend = () => {
            if(aiIn.value.trim()) { this.handleAI(aiIn.value.trim()); aiIn.value = ''; }
        };
        aiBtn.onclick = handleSend;
        aiIn.onkeypress = (e) => e.key === 'Enter' && handleSend();
    },

    renderAll: function() {
        this.renderLessons();
        this.renderCodes();
        this.renderStudyCases();
        this.renderUserCases();
        this.updateProgressUI();
    },

    // --- AI LOGIC (Fallback) ---
    handleAI: function(q) {
        const c = document.getElementById('ai-chat-container');
        c.innerHTML += `<div class="flex gap-4 justify-end"><div class="bg-primary text-white px-4 py-3 rounded-2xl text-sm max-w-[85%]">${this.escape(q)}</div></div>`;
        c.scrollTop = c.scrollHeight;

        setTimeout(() => {
            let ans = q.toLowerCase().includes('shartnoma') 
                ? "Shartnoma tomonlarning huquq va majburiyatlarini belgilovchi kelishuvdir. Bu qonuniydir."
                : "Kechirasiz, men hozir oflayn demoman. Savolingiz tahlil qilinmoqda, lekin haqiqiy API ulanmagan.";
            
            c.innerHTML += `<div class="flex gap-4"><div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary"><i class="fa-solid fa-robot"></i></div><div class="chat-bubble-ai bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl text-sm max-w-[85%]">
                <p>${ans}</p>
                <button onclick="app.startAudio('${ans}')" class="mt-2 text-xs text-primary font-bold"><i class="fa-solid fa-volume-high"></i> O'qish</button>
            </div></div>`;
            c.scrollTop = c.scrollHeight;
        }, 600);
    },

    // --- SPEECH TO TEXT ---
    setupSpeechToText: function() {
        const btn = document.getElementById('ai-stt-btn');
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(SR) {
            const r = new SR();
            r.continuous = false;
            btn.onclick = () => {
                r.lang = this.state.settings.lang === 'uz' ? 'uz-UZ' : (this.state.settings.lang === 'ru' ? 'ru-RU' : 'en-US');
                r.start();
                btn.classList.add('text-red-500', 'animate-pulse');
            };
            r.onresult = (e) => { document.getElementById('ai-input').value = e.results[0][0].transcript; };
            r.onend = r.onerror = () => btn.classList.remove('text-red-500', 'animate-pulse');
        } else {
            btn.style.display = 'none';
        }
    },

    // --- AUDIO LOGIC ---
    startAudio: function(txt) {
        this.state.audio.text = txt;
        document.getElementById('audio-player').classList.remove('translate-y-32');
        this.playAudio();
    },
    playAudio: function() {
        if(!this.state.audio.synth) return alert("Audio qo'llab-quvvatlanmaydi.");
        if(this.state.audio.synth.paused) {
            this.state.audio.synth.resume();
        } else {
            this.state.audio.synth.cancel();
            const ut = new SpeechSynthesisUtterance(this.state.audio.text);
            ut.lang = this.state.settings.lang === 'ru' ? 'ru-RU' : 'uz-UZ';
            ut.rate = this.state.settings.speed;
            ut.onend = () => this.stopAudio();
            this.state.audio.synth.speak(ut);
        }
        document.getElementById('audio-play').classList.add('hidden');
        document.getElementById('audio-pause').classList.remove('hidden');
        document.getElementById('audio-status').innerText = "O'qilmoqda...";
    },
    pauseAudio: function() {
        if(this.state.audio.synth) this.state.audio.synth.pause();
        document.getElementById('audio-play').classList.remove('hidden');
        document.getElementById('audio-pause').classList.add('hidden');
        document.getElementById('audio-status').innerText = "Pauza";
    },
    stopAudio: function() {
        if(this.state.audio.synth) this.state.audio.synth.cancel();
        document.getElementById('audio-play').classList.remove('hidden');
        document.getElementById('audio-pause').classList.add('hidden');
        document.getElementById('audio-status').innerText = "Tayyor";
    },

    // --- RENDERERS ---
    renderLessons: function() {
        document.getElementById('lessons-container').innerHTML = this.state.data.lessons.map(l => `
            <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2 inline-block">${l.level}</span>
                <h3 class="font-bold text-lg mb-2">${l.title}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">${l.simple_explanation}</p>
                <div class="flex justify-between items-center">
                    <button onclick="app.startAudio('${l.audio_text}')" class="text-primary"><i class="fa-solid fa-volume-high"></i></button>
                    <button onclick="app.addScore(10); alert('Dars tugatildi! +10 ball')" class="text-xs bg-primary text-white px-3 py-1 rounded">O'qish</button>
                </div>
            </div>
        `).join('');
    },

    renderCodes: function() {
        document.getElementById('codes-container').innerHTML = this.state.data.codes.map(c => `
            <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
                <h3 class="font-bold text-xl text-primary mb-4">${c.title}</h3>
                ${c.sections.map(s => `
                    <h4 class="font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">${s.title}</h4>
                    ${s.articles.map(a => `
                        <div class="mb-4 pl-4 border-l-2 border-primary">
                            <p class="font-bold text-sm">${a.number}: ${a.title}</p>
                            <p class="text-sm mt-1">${a.text}</p>
                            <button onclick="app.startAudio('${a.text}')" class="text-xs text-primary mt-2"><i class="fa-solid fa-volume-high"></i> Eshitish</button>
                        </div>
                    `).join('')}
                `).join('')}
            </div>
        `).join('');
    },

    renderStudyCases: function() {
        document.getElementById('studycases-container').innerHTML = this.state.data.cases.map(c => `
            <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-lg mb-2">${c.title}</h3>
                <p class="text-sm bg-slate-50 dark:bg-slate-700 p-3 rounded mb-4">${c.scenario}</p>
                <button onclick="alert('Yechim: ${c.explanation}')" class="text-sm bg-amber-500 text-white px-4 py-2 rounded">Yechimni ko'rish</button>
            </div>
        `).join('');
    },

    // --- USER CASES CRUD ---
    showCaseForm: function(id = null) {
        document.getElementById('case-form-container').classList.remove('hidden');
        if(id) {
            const c = this.state.userCases.find(x => x.id === id);
            if(c) {
                document.getElementById('case-id').value = c.id;
                document.getElementById('case-client').value = c.client;
                document.getElementById('case-type').value = c.type;
                document.getElementById('case-desc').value = c.desc;
            }
        } else {
            document.getElementById('case-id').value = '';
            document.getElementById('case-client').value = '';
            document.getElementById('case-desc').value = '';
        }
    },
    hideCaseForm: function() {
        document.getElementById('case-form-container').classList.add('hidden');
    },
    saveUserCase: function() {
        const id = document.getElementById('case-id').value;
        const client = document.getElementById('case-client').value;
        const type = document.getElementById('case-type').value;
        const desc = document.getElementById('case-desc').value;
        
        if(!client) return alert("Mijoz ismini kiriting!");

        if(id) {
            const idx = this.state.userCases.findIndex(x => x.id === id);
            if(idx > -1) this.state.userCases[idx] = { id, client, type, desc, date: new Date().toLocaleDateString() };
        } else {
            this.state.userCases.push({ id: Date.now().toString(), client, type, desc, date: new Date().toLocaleDateString() });
        }
        
        this.saveStorage();
        this.hideCaseForm();
        this.renderUserCases();
    },
    deleteUserCase: function(id) {
        if(confirm("Haqiqatan ham o'chirasizmi?")) {
            this.state.userCases = this.state.userCases.filter(x => x.id !== id);
            this.saveStorage();
            this.renderUserCases();
        }
    },
    renderUserCases: function() {
        const c = document.getElementById('usercases-list');
        if(!this.state.userCases.length) { c.innerHTML = '<p class="text-sm text-slate-500">Hozircha ishlar yo\'q.</p>'; return; }
        
        c.innerHTML = this.state.userCases.map(u => `
            <div class="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-bold">${u.client}</h4>
                        <span class="text-xs text-slate-500">${u.date} | ${u.type}</span>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="app.showCaseForm('${u.id}')" class="text-blue-500"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="app.deleteUserCase('${u.id}')" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <p class="text-sm text-slate-700 dark:text-slate-300">${u.desc}</p>
            </div>
        `).join('');
    },

    // --- DOC GENERATOR ---
    generateDoc: function() {
        const type = document.getElementById('doc-type').value;
        const name = document.getElementById('doc-name').value || "[F.I.SH]";
        const details = document.getElementById('doc-details').value || "[Tafsilotlar]";
        
        let res = "";
        if(type === 'ariza') {
            res = `DA'VO ARIZASI\n\nMen, ${name}, ushbu ariza orqali shuni ma'lum qilamanki:\n\n${details}\n\nYuqoridagilardan kelib chiqib, qonuniy choralar ko'rishingizni so'rayman.\n\nSana: ${new Date().toLocaleDateString()}\nImzo: _________`;
        } else {
            res = `SHIKOYAT XATI\n\nMen, ${name}, quyidagi holat yuzasidan shikoyat qilaman:\n\n${details}\n\nIltimos, ushbu holatni o'rganib chiqib, huquqlarimni tiklashda amaliy yordam bering.\n\nSana: ${new Date().toLocaleDateString()}\nImzo: _________`;
        }
        document.getElementById('doc-result').value = res;
    },
    copyDoc: function() {
        const t = document.getElementById('doc-result');
        t.select();
        document.execCommand('copy');
        alert("Nusxa olindi!");
    },

    // --- CONTRACT REVIEW ---
    reviewContract: function() {
        const txt = document.getElementById('contract-input').value.toLowerCase();
        let issues = [];
        
        if(!txt.trim()) return alert("Matn kiriting!");
        
        if(txt.includes('jarima') || txt.includes('penya')) issues.push("Jarima (Penya): Shartnomada jarima miqdorlari mavjud. Ularning adolatli foizda ekanligini tekshiring.");
        if(txt.includes('muddat')) issues.push("Muddat: Majburiyatlarni bajarish muddatlari ko'rsatilgan. Ular siz uchun qulayligini tasdiqlang.");
        if(txt.includes('fors-major')) issues.push("Fors-major: Yengib bo'lmas kuch holatlari kiritilgan. Bu standart va xavfsiz band.");
        if(issues.length === 0) issues.push("Matnda yaqqol xavfli terminlar topilmadi. Ammo huquqshunos bilan maslahatlashish tavsiya etiladi.");
        
        document.getElementById('contract-result').innerHTML = issues.map(i => `<li class="text-sm mb-2 border-l-2 border-amber-500 pl-2">${i}</li>`).join('');
        document.getElementById('contract-result-container').classList.remove('hidden');
    },

    // --- TESTS & PROGRESS ---
    startTest: function() {
        document.getElementById('test-intro').classList.add('hidden');
        document.getElementById('test-active').classList.remove('hidden');
        const t = this.state.data.tests[0]; // Just showing first for demo
        document.getElementById('test-active').innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
                <h3 class="font-bold text-xl mb-6">${t.question}</h3>
                <div class="space-y-3">
                    ${t.options.map((o, i) => `
                        <button onclick="app.submitTest(${i}, ${t.correct_index})" class="w-full p-4 text-left border rounded hover:bg-slate-50 dark:hover:bg-slate-700">${o}</button>
                    `).join('')}
                </div>
            </div>
        `;
    },
    submitTest: function(sel, cor) {
        if(sel === cor) {
            alert("To'g'ri! +20 ball.");
            this.addScore(20);
        } else {
            alert("Xato javob.");
        }
        document.getElementById('test-intro').classList.remove('hidden');
        document.getElementById('test-active').classList.add('hidden');
        this.switchTab('progress');
    },
    addScore: function(pts) {
        this.state.progress.score += pts;
        let s = this.state.progress.score;
        if(s >= 100) this.state.progress.level = "Professional";
        else if(s >= 50) this.state.progress.level = "Havaskor";
        this.saveStorage();
        this.updateProgressUI();
    },
    updateProgressUI: function() {
        const el = document.getElementById('prog-score');
        if(el) {
            el.innerText = this.state.progress.score;
            document.getElementById('prog-level').innerText = this.state.progress.level;
        }
    },

    escape: function(str) {
        return str.replace(/[&<>'"]/g, t => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t]));
    }
};

document.addEventListener('DOMContentLoaded', () => window.app.init());
