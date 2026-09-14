// Navigation configuration
const NAV_ITEMS = [
    { id: 'home', icon: 'fa-house', label: 'Bosh Sahifa', showMobile: true },
    { id: 'ai', icon: 'fa-robot', label: 'AI Yurist', showMobile: true },
    { id: 'lessons', icon: 'fa-book', label: 'Huquq Darslari', showMobile: true },
    { id: 'codes', icon: 'fa-scale-unbalanced', label: 'Kodekslar', showMobile: true },
    { id: 'cases', icon: 'fa-users-viewfinder', label: 'Vaziyatlar', showMobile: false },
    { id: 'tests', icon: 'fa-list-check', label: 'Testlar', showMobile: false },
    { id: 'progress', icon: 'fa-chart-pie', label: 'Natijalarim', showMobile: true }
];

// App State
const state = {
    currentTab: 'home',
    data: {
        laws: [], codes: [], lessons: [], tests: [], cases: []
    },
    progress: JSON.parse(localStorage.getItem('lawMasterProgress')) || {
        score: 0,
        level: 'Boshlang\'ich',
        completedLessons: [],
        completedTests: []
    },
    settings: JSON.parse(localStorage.getItem('lawMasterSettings')) || {
        theme: 'light',
        lang: 'uz',
        speed: 1
    },
    audio: {
        synth: window.speechSynthesis,
        utterance: null,
        isPlaying: false,
        textToPlay: ''
    }
};

// Main App Controller
window.app = {
    init: async function() {
        this.setupTheme();
        this.renderNavigation();
        this.bindEvents();
        await this.loadData();
        this.updateProgressUI();
        this.switchTab('home');
        
        // Handle Speech Synthesis issues on load
        if(state.audio.synth) {
            state.audio.synth.cancel();
        }
    },

    setupTheme: function() {
        const root = document.documentElement;
        if (state.settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        document.getElementById('theme-toggle').innerHTML = state.settings.theme === 'dark' 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
    },

    toggleTheme: function() {
        state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('lawMasterSettings', JSON.stringify(state.settings));
        this.setupTheme();
    },

    renderNavigation: function() {
        const desktopNav = document.getElementById('desktop-nav');
        const mobileNav = document.getElementById('mobile-nav').querySelector('div');
        
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';

        NAV_ITEMS.forEach(item => {
            // Desktop
            const dBtn = document.createElement('button');
            dBtn.className = `nav-item w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-300 font-medium ${item.id === state.currentTab ? 'active' : ''}`;
            dBtn.dataset.target = item.id;
            dBtn.innerHTML = `<i class="fa-solid ${item.icon} w-5 text-center"></i> ${item.label}`;
            dBtn.onclick = () => this.switchTab(item.id);
            desktopNav.appendChild(dBtn);

            // Mobile
            if (item.showMobile) {
                const mBtn = document.createElement('button');
                mBtn.className = `mobile-nav-item flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary dark:hover:text-blue-400 transition-colors ${item.id === state.currentTab ? 'active' : ''}`;
                mBtn.dataset.target = item.id;
                mBtn.innerHTML = `<i class="fa-solid ${item.icon} text-lg mb-1"></i><span class="text-[10px] font-medium">${item.label}</span>`;
                mBtn.onclick = () => this.switchTab(item.id);
                mobileNav.appendChild(mBtn);
            }
        });
    },

    switchTab: function(tabId) {
        // Stop audio when switching tabs
        this.stopAudio();
        
        state.currentTab = tabId;
        
        // Update UI
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById(`view-${tabId}`).classList.add('active');
        
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.target === tabId);
        });
        document.querySelectorAll('.mobile-nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.target === tabId);
        });
        
        // Render specific content if needed
        if(tabId === 'lessons') this.renderLessons();
        if(tabId === 'codes') this.renderCodes();
        if(tabId === 'cases') this.renderCases();
        if(tabId === 'progress') this.updateProgressUI();
        
        // Scroll to top
        document.getElementById('content-area').scrollTop = 0;
    },

    async loadData() {
        try {
            // Using standard fetch, assuming data is relative to index.html (or in public/data for dev)
            const files = ['laws.json', 'codes.json', 'lessons.json', 'tests.json', 'cases.json'];
            
            for (let file of files) {
                const response = await fetch(`data/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    state.data[file.replace('.json', '')] = data;
                } else {
                    console.warn(`Could not load ${file}`);
                }
            }
        } catch (e) {
            console.error("Ma'lumotlarni yuklashda xatolik:", e);
        }
    },

    bindEvents: function() {
        document.getElementById('theme-toggle').onclick = () => this.toggleTheme();
        
        // AI Chat
        const aiInput = document.getElementById('ai-input');
        const aiBtn = document.getElementById('ai-send-btn');
        const handleSend = () => {
            if(aiInput.value.trim()) {
                this.handleAIQuery(aiInput.value.trim());
                aiInput.value = '';
            }
        };
        aiBtn.onclick = handleSend;
        aiInput.onkeypress = (e) => e.key === 'Enter' && handleSend();

        // Audio controls
        document.getElementById('audio-play').onclick = () => this.playAudio();
        document.getElementById('audio-pause').onclick = () => this.pauseAudio();
        document.getElementById('audio-stop').onclick = () => this.stopAudio();
        document.getElementById('audio-close').onclick = () => this.hideAudioPlayer();
        document.getElementById('audio-speed').onchange = (e) => {
            state.settings.speed = parseFloat(e.target.value);
            localStorage.setItem('lawMasterSettings', JSON.stringify(state.settings));
            if(state.audio.isPlaying) {
                // restart with new speed
                let currentText = state.audio.textToPlay;
                this.stopAudio();
                setTimeout(() => this.startAudio(currentText), 50);
            }
        };
    },

    // --- AI Logic (Rule-based mockup) ---
    handleAIQuery: function(query) {
        const container = document.getElementById('ai-chat-container');
        
        // Add User Message
        const userHtml = `
            <div class="flex gap-4 justify-end">
                <div class="chat-bubble-user px-4 py-3 rounded-2xl text-sm md:text-base max-w-[85%] shadow-sm">
                    ${this.escapeHTML(query)}
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', userHtml);
        container.scrollTop = container.scrollHeight;

        // Simulate thinking
        setTimeout(() => {
            const aiHtml = `
            <div class="flex gap-4">
                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 flex items-center justify-center text-primary dark:text-blue-400">
                    <i class="fa-solid fa-robot text-sm"></i>
                </div>
                <div class="chat-bubble-ai px-4 py-3 rounded-2xl text-sm md:text-base max-w-[85%] shadow-sm">
                    ${this.generateAIResponse(query)}
                    <button onclick="app.startAudio(this.parentElement.innerText)" class="mt-3 text-xs text-primary dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline">
                        <i class="fa-solid fa-volume-high"></i> O'qib berish
                    </button>
                </div>
            </div>`;
            container.insertAdjacentHTML('beforeend', aiHtml);
            container.scrollTop = container.scrollHeight;
        }, 800);
    },

    generateAIResponse: function(query) {
        const q = query.toLowerCase();
        
        // Very basic matching based on offline data
        if(q.includes('shartnoma')) {
            return `<b>Savolga qisqa javob:</b> Shartnoma tomonlarning huquq va majburiyatlarini belgilovchi kelishuvdir.<br><br>
            <b>Batafsil tushuntirish:</b> Fuqarolik Kodeksining 1-moddasiga ko'ra, munosabatlar ishtirokchilarining tengligi va shartnoma erkinligi asosiy prinsiplardir. Siz xohlagan qonuniy shartnomani tuzishga haqlisiz.<br><br>
            <b>Tegishli qonun/modda:</b> FK 1-modda.<br>
            <b>Muhim ogohlantirish:</b> Ushbu javob ta'limiy xarakterga ega.`;
        }
        
        if(q.includes('mehnat') || q.includes('maosh') || q.includes('ish')) {
            return `<b>Savolga qisqa javob:</b> Mehnat munosabatlari Mehnat Kodeksi bilan tartibga solinadi.<br><br>
            <b>Batafsil tushuntirish:</b> Har qanday ishga qabul qilish mehnat shartnomasi bilan rasmiylashtirilishi shart. Agar maoshingiz berilmasa, Mehnat inspeksiyasiga murojaat qilish huquqiga egasiz.<br><br>
            <b>Tegishli qonun/modda:</b> Mehnat Kodeksi 1-modda.<br>
            <b>Ogohlantirish:</b> Ushbu javob ta'limiy xarakterga ega.`;
        }

        return `Kechirasiz, oflayn rejimda bu savolga aniq javob topa olmadim. Iltimos, huquq sohasi, shartnoma, mehnat yoki kodekslar haqida so'rab ko'ring.`;
    },

    // --- Audio Logic ---
    startAudio: function(text) {
        const cleanedText = text.replace(/O'qib berish/g, '').trim();
        state.audio.textToPlay = cleanedText;
        
        const player = document.getElementById('audio-player');
        player.classList.remove('translate-y-32');
        
        this.playAudio();
    },

    playAudio: function() {
        if(!state.audio.synth) return alert("Brauzeringiz audio funksiyasini qo'llab-quvvatlamaydi.");
        
        if(state.audio.synth.paused) {
            state.audio.synth.resume();
        } else {
            state.audio.synth.cancel();
            state.audio.utterance = new SpeechSynthesisUtterance(state.audio.textToPlay);
            state.audio.utterance.lang = state.settings.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
            state.audio.utterance.rate = state.settings.speed;
            
            state.audio.utterance.onend = () => {
                this.stopAudio();
                document.getElementById('audio-status').innerText = 'Tugadi';
            };
            
            state.audio.synth.speak(state.audio.utterance);
        }
        
        state.audio.isPlaying = true;
        document.getElementById('audio-play').classList.add('hidden');
        document.getElementById('audio-pause').classList.remove('hidden');
        document.getElementById('audio-status').innerText = "O'qilmoqda...";
    },

    pauseAudio: function() {
        if(state.audio.synth && state.audio.isPlaying) {
            state.audio.synth.pause();
            state.audio.isPlaying = false;
            document.getElementById('audio-play').classList.remove('hidden');
            document.getElementById('audio-pause').classList.add('hidden');
            document.getElementById('audio-status').innerText = "Pauza";
        }
    },

    stopAudio: function() {
        if(state.audio.synth) {
            state.audio.synth.cancel();
        }
        state.audio.isPlaying = false;
        document.getElementById('audio-play').classList.remove('hidden');
        document.getElementById('audio-pause').classList.add('hidden');
        document.getElementById('audio-status').innerText = "To'xtatildi";
    },

    hideAudioPlayer: function() {
        this.stopAudio();
        document.getElementById('audio-player').classList.add('translate-y-32');
    },

    // --- Renderers ---
    renderLessons: function() {
        const container = document.getElementById('lessons-container');
        if(!state.data.lessons.length) {
            container.innerHTML = '<p class="text-slate-500">Darslar yuklanmoqda yoki mavjud emas.</p>';
            return;
        }

        container.innerHTML = state.data.lessons.map(lesson => `
            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover-card flex flex-col">
                <div class="p-6 flex-1">
                    <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-primary dark:text-blue-300 text-xs font-bold rounded-full mb-3">${lesson.level}</span>
                    <h3 class="font-bold text-xl mb-2">${lesson.title}</h3>
                    <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">${lesson.simple_explanation.substring(0, 80)}...</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-700/50 p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <button onclick="app.startAudio('${lesson.audio_text.replace(/'/g, "\\'")}')" class="text-slate-500 hover:text-primary transition-colors p-2">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                    <button onclick="app.completeLesson('${lesson.id}')" class="text-primary dark:text-blue-400 font-semibold text-sm hover:underline">
                        O'qishni boshlash <i class="fa-solid fa-chevron-right text-xs ml-1"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderCodes: function() {
        const container = document.getElementById('codes-container');
        if(!state.data.codes.length) {
            container.innerHTML = '<p class="text-slate-500">Kodekslar yuklanmoqda yoki mavjud emas.</p>';
            return;
        }

        let html = '';
        state.data.codes.forEach(code => {
            html += `<div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-4">
                <h3 class="font-bold text-xl brand-font mb-4 text-primary dark:text-blue-400">${code.title}</h3>
            `;
            
            code.sections.forEach(sec => {
                html += `<h4 class="font-semibold text-lg mt-4 mb-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">${sec.title}</h4>`;
                
                sec.articles.forEach(art => {
                    html += `
                        <div class="mb-4 pl-4 border-l-2 border-slate-200 dark:border-slate-600">
                            <div class="flex justify-between items-start">
                                <h5 class="font-bold text-sm text-slate-700 dark:text-slate-300">${art.number}: ${art.title}</h5>
                                <button onclick="app.startAudio('${art.text.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-primary transition-colors">
                                    <i class="fa-solid fa-volume-high text-xs"></i>
                                </button>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${art.text}</p>
                            <div class="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs text-blue-800 dark:text-blue-300">
                                <strong>Oddiy tilda:</strong> ${art.explanation}
                            </div>
                        </div>
                    `;
                });
            });
            html += `</div>`;
        });
        
        container.innerHTML = html;
    },

    renderCases: function() {
        const container = document.getElementById('cases-container');
        if(!state.data.cases.length) {
            container.innerHTML = '<p class="text-slate-500">Vaziyatlar yuklanmoqda yoki mavjud emas.</p>';
            return;
        }

        container.innerHTML = state.data.cases.map(c => `
            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 class="font-bold text-lg mb-2 text-primary dark:text-blue-400">${c.title}</h3>
                <p class="text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">${c.scenario}</p>
                
                <div class="space-y-4 mb-4">
                    ${c.questions.map((q, idx) => `
                        <div>
                            <p class="font-semibold text-sm mb-2">${idx+1}. ${q.q}</p>
                            <div class="flex flex-wrap gap-2">
                                ${q.options.map(opt => `
                                    <button onclick="alert('Batafsil yechim test orqali taqdim etiladi. Yechim: ${c.explanation}')" class="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">${opt}</button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    // --- Progress & Test Logic ---
    completeLesson: function(id) {
        if(!state.progress.completedLessons.includes(id)) {
            state.progress.completedLessons.push(id);
            this.addScore(10);
        }
        alert("Dars muvaffaqiyatli o'qildi! +10 ball");
    },
    
    startTest: function() {
        document.getElementById('test-intro').classList.add('hidden');
        document.getElementById('test-active').classList.remove('hidden');
        
        const container = document.getElementById('test-active');
        const tests = state.data.tests || [];
        
        if(!tests.length) {
            container.innerHTML = '<p>Testlar mavjud emas.</p>';
            return;
        }

        // Just render the first test as an example
        const t = tests[0];
        container.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">${t.level}</span>
                    <span class="text-sm font-semibold text-slate-500">1 / ${tests.length}</span>
                </div>
                
                <h3 class="text-xl font-bold mb-6">${t.question}</h3>
                
                <div class="space-y-3">
                    ${t.options.map((opt, i) => `
                        <button onclick="app.submitAnswer(${i}, ${t.correct_index})" class="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all font-medium">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    submitAnswer: function(selectedIndex, correctIndex) {
        if(selectedIndex === correctIndex) {
            this.addScore(20);
            alert("To'g'ri javob! +20 ball \n(Demoga faqat 1 ta test ulangan)");
        } else {
            alert("Noto'g'ri javob. Qayta urinib ko'ring.");
        }
        
        // Reset UI
        document.getElementById('test-intro').classList.remove('hidden');
        document.getElementById('test-active').classList.add('hidden');
        this.switchTab('progress');
    },

    addScore: function(points) {
        state.progress.score += points;
        
        // Update level
        if(state.progress.score > 200) state.progress.level = 'Professional yurist';
        else if(state.progress.score > 100) state.progress.level = 'Yosh yurist';
        else if(state.progress.score > 50) state.progress.level = 'Huquq bilimdoni';
        else if(state.progress.score > 20) state.progress.level = 'Huquq o\'rganuvchi';
        
        localStorage.setItem('lawMasterProgress', JSON.stringify(state.progress));
        this.updateProgressUI();
    },

    updateProgressUI: function() {
        document.getElementById('user-score-display').innerText = state.progress.score;
        document.getElementById('user-level-display').innerText = state.progress.level;
        
        const progScore = document.getElementById('prog-score');
        const progLevel = document.getElementById('prog-level');
        const progLessons = document.getElementById('prog-lessons');
        
        if(progScore) progScore.innerText = state.progress.score;
        if(progLevel) progLevel.innerText = state.progress.level;
        if(progLessons) progLessons.innerText = state.progress.completedLessons.length;
    },

    escapeHTML: function(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});
