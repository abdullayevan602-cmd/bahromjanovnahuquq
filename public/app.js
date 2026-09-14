const app = {
    view: 'home',
    init() {
        this.ui.initTheme();
        this.nav.init();
        this.events();
        this.render.home();
        this.i18n.apply();
    },

    events() {
        document.getElementById('theme-toggle').addEventListener('click', () => this.ui.toggleTheme());
        document.getElementById('lang-switcher').addEventListener('change', (e) => {
            localStorage.setItem('lang', e.target.value);
            this.i18n.apply();
            this.ui.toast("Til o'zgartirildi / Language changed", "success");
        });
        document.getElementById('mobile-menu-btn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('-translate-x-full'));
        document.getElementById('global-search').addEventListener('keypress', (e) => {
            if(e.key === 'Enter' && e.target.value.trim() !== '') {
                this.nav.goTo('ai');
                document.getElementById('ai-input').value = `Iltimos, ushbu mavzuda qonuniy ma'lumot bering: ${e.target.value}`;
                aiController.sendMessage();
                e.target.value = '';
            }
        });
    },

    ui: {
        initTheme() {
            if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            }
        },
        toggleTheme() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        },
        toast(msg, type = 'info') {
            const box = document.getElementById('toast-container');
            const el = document.createElement('div');
            let color = type === 'error' ? 'bg-red-50 text-red-800' : type === 'success' ? 'bg-green-50 text-green-800' : 'bg-primary-50 text-primary-900';
            el.className = `toast-enter flex items-center gap-3 p-4 rounded-xl border shadow-lg ${color}`;
            el.innerHTML = `<p class="text-sm font-medium">${msg}</p>`;
            box.appendChild(el);
            setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
        }
    },

    nav: {
        items: [
            { id: 'home', icon: 'fa-home', label: 'Bosh sahifa' },
            { id: 'ai', icon: 'fa-robot', label: 'AI Yordamchi' },
            { id: 'const', icon: 'fa-book-open', label: 'Konstitutsiya' },
            { id: 'codes', icon: 'fa-scale-balanced', label: 'Kodekslar' },
            { id: 'docs', icon: 'fa-file-signature', label: 'Hujjatlar' },
            { id: 'dict', icon: 'fa-spell-check', label: 'Huquqiy lug\'at' },
            { id: 'test', icon: 'fa-check-double', label: 'Huquqiy testlar' },
            { id: 'profile', icon: 'fa-user-circle', label: 'Profil / Tarix' }
        ],
        init() {
            document.getElementById('nav-menu').innerHTML = this.items.map(i => `
                <a href="#" onclick="app.nav.goTo('${i.id}')" id="nav-${i.id}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition">
                    <i class="fas ${i.icon} w-5 text-center text-lg"></i> <span class="font-medium" data-i18n="nav_${i.id}">${i.label}</span>
                </a>
            `).join('');
            this.buildViews();
            this.goTo('home');
        },
        goTo(id) {
            document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
            document.getElementById(`view-${id}`).classList.remove('hidden');
            
            document.querySelectorAll('#nav-menu a').forEach(el => el.classList.remove('bg-primary-50', 'text-primary-600', 'dark:bg-gray-700'));
            document.getElementById(`nav-${id}`).classList.add('bg-primary-50', 'text-primary-600', 'dark:bg-gray-700');
            
            app.view = id;
            if(window.innerWidth < 1024) document.getElementById('sidebar').classList.add('-translate-x-full');
            
            if(id === 'const') app.render.constitution();
            if(id === 'codes') app.render.codes();
            if(id === 'docs') app.render.docs();
            if(id === 'dict') app.render.dict();
            if(id === 'test' && !app.tests.active) app.tests.start();
            if(id === 'profile') app.render.profile();
        },
        buildViews() {
            const c = document.getElementById('views');
            this.items.forEach(i => {
                c.innerHTML += `<section id="view-${i.id}" class="view-section hidden animate-fade-in flex-col h-full"></section>`;
            });

            document.getElementById('view-home').innerHTML = `
                <h1 class="text-4xl font-serif font-black text-gray-900 dark:text-white mb-4" data-i18n="know_rights">Huquqingizni biling.</h1>
                <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl" data-i18n="home_desc">Professional yuridik portal. Qonunlar, hujjatlar va AI yordamchisi.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="home-grid"></div>
            `;
            
            document.getElementById('view-ai').innerHTML = `
                <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white mb-6">AI Yuridik Yordamchi</h2>
                <div class="flex-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden min-h-[60vh]">
                    <div id="ai-chat-box" class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
                        <div class="flex items-start gap-4 mb-6 animate-fade-in">
                            <div class="w-10 h-10 rounded-full bg-primary-900 text-gold-500 flex justify-center items-center shrink-0"><i class="fas fa-scale-balanced"></i></div>
                            <div class="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                <p class="text-sm">Assalomu alaykum! Men LEGAL UZ sun'iy intellektiman. Sizga qanday huquqiy masalada yordam bera olaman?</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-white dark:bg-gray-800 border-t flex gap-2 shrink-0">
                        <button id="btn-mic" onclick="aiController.stt.toggle()" class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-primary-500 transition shrink-0"><i class="fas fa-microphone"></i></button>
                        <textarea id="ai-input" placeholder="Huquqiy muammongizni yozing..." class="input-base resize-none custom-scrollbar py-3 min-h-[48px]" onkeypress="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); aiController.sendMessage(); }"></textarea>
                        <button onclick="aiController.sendMessage()" class="w-12 h-12 rounded-xl bg-primary-900 text-gold-500 hover:bg-primary-800 transition shadow-md shrink-0"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            `;

            document.getElementById('view-const').innerHTML = `<h2 class="text-3xl font-serif font-black mb-6 dark:text-white">Konstitutsiya</h2><input type="text" placeholder="Moddani qidirish..." class="input-base mb-6" onkeyup="app.render.constitution(this.value)"><div id="const-list" class="space-y-6"></div>`;
            document.getElementById('view-codes').innerHTML = `<h2 class="text-3xl font-serif font-black mb-6 dark:text-white">Kodekslar</h2><div id="codes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>`;
            document.getElementById('view-dict').innerHTML = `<h2 class="text-3xl font-serif font-black mb-6 dark:text-white">Huquqiy Lug'at</h2><input type="text" placeholder="Termin qidirish..." class="input-base mb-6" onkeyup="app.render.dict(this.value)"><div id="dict-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>`;
            
            document.getElementById('view-docs').innerHTML = `
                <h2 class="text-3xl font-serif font-black mb-6 dark:text-white">Hujjat Generatori</h2>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-y-auto custom-scrollbar" id="doc-list"></div>
                    <div class="lg:col-span-2 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar pb-10">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"><h3 id="doc-title" class="font-bold mb-4 text-xl text-primary-900 dark:text-primary-400"></h3><form id="doc-form" class="space-y-4"></form></div>
                        <div id="doc-res-box" class="hidden bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 class="font-bold">Tayyor hujjat natijasi</h3>
                                <div class="flex gap-2">
                                    <button onclick="app.render.docAction('copy')" class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 text-gray-600 hover:text-primary-600 flex items-center justify-center transition" title="Nusxalash"><i class="fas fa-copy"></i></button>
                                    <button onclick="app.render.docAction('pdf')" class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 text-gray-600 hover:text-primary-600 flex items-center justify-center transition" title="Chop etish / PDF"><i class="fas fa-print"></i></button>
                                </div>
                            </div>
                            <pre id="doc-out" class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-sm whitespace-pre-wrap font-serif text-gray-800 dark:text-gray-200 leading-relaxed border border-gray-200 dark:border-gray-700"></pre>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('view-test').innerHTML = `<h2 class="text-3xl font-serif font-black mb-6 dark:text-white">Huquqiy Testlar</h2><div id="test-box" class="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"></div>`;
            document.getElementById('view-profile').innerHTML = `<h2 class="text-3xl font-serif font-black mb-6 dark:text-white">Profil va Tarix</h2><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"><h3 class="font-bold text-xl mb-4"><i class="fas fa-star text-gold-500 mr-2"></i> Favoritlar</h3><div id="prof-favs" class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"></div></div><div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"><h3 class="font-bold text-xl mb-4"><i class="fas fa-history text-primary-500 mr-2"></i> Tarix</h3><div id="prof-hist" class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"></div></div></div>`;
        }
    },

    render: {
        home() {
            document.getElementById('home-grid').innerHTML = app.nav.items.filter(i => i.id !== 'home' && i.id !== 'profile').map(i => `
                <div onclick="app.nav.goTo('${i.id}')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover-card group">
                    <div class="w-14 h-14 rounded-xl bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors"><i class="fas ${i.icon}"></i></div>
                    <h3 class="text-xl font-bold dark:text-white mb-2" data-i18n="nav_${i.id}">${i.label}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Kirish &rarr;</p>
                </div>`).join('');
        },
        constitution(q = '') {
            app.state.history.add('Oqildi', 'Konstitutsiya bo\'limi');
            document.getElementById('const-list').innerHTML = db.constitution.filter(a => a.text.toLowerCase().includes(q.toLowerCase()) || a.title.toLowerCase().includes(q.toLowerCase())).map(a => {
                const isFav = app.state.favs.check('const', a.id);
                return `
                <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-primary-900 dark:text-primary-400">${a.num}-modda. <span class="font-medium text-gray-700 dark:text-gray-300">${a.title}</span></h3>
                        <div class="flex gap-2">
                            <button onclick="app.audio.play('${a.text.replace(/'/g, "\\'")}', '${a.num}-modda')" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition"><i class="fas fa-volume-up"></i></button>
                            <button onclick="app.state.favs.toggle('const', ${a.id}, '${a.num}-modda')" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 ${isFav?'text-gold-500':'text-gray-400'} hover:bg-gold-50 hover:text-gold-500 flex items-center justify-center transition"><i class="fas fa-star"></i></button>
                        </div>
                    </div>
                    <p class="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">${a.text}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div class="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 p-4 rounded-xl">
                            <h4 class="font-bold text-sm mb-2 text-primary-800 dark:text-primary-300 flex items-center gap-2"><i class="fas fa-info-circle"></i> Oddiy tilda</h4>
                            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${a.simple}</p>
                        </div>
                        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-4 rounded-xl">
                            <h4 class="font-bold text-sm mb-2 text-amber-800 dark:text-amber-300 flex items-center gap-2"><i class="fas fa-lightbulb"></i> Amaliy misol</h4>
                            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${a.example}</p>
                        </div>
                    </div>
                </div>`}).join('') || '<p class="text-gray-500 py-8 text-center">Topilmadi</p>';
        },
        codes() { document.getElementById('codes-grid').innerHTML = db.codes.map(c => `<div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover-card flex gap-4"><div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl shrink-0"><i class="fas ${c.icon}"></i></div><div><h4 class="font-bold text-gray-900 dark:text-white">${c.title}</h4><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${c.desc}</p></div></div>`).join(''); },
        dict(q = '') { document.getElementById('dict-list').innerHTML = db.dictionary.filter(d => d.term.toLowerCase().includes(q.toLowerCase()) || d.desc.toLowerCase().includes(q.toLowerCase())).map(d => `<div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition"><div class="flex justify-between mb-2"><h4 class="font-bold text-primary-900 dark:text-primary-400">${d.term}</h4><button onclick="app.audio.play('${d.desc}', '${d.term}')" class="text-gray-400 hover:text-primary-500 transition"><i class="fas fa-volume-up"></i></button></div><p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">${d.desc}</p></div>`).join('') || '<p class="text-gray-500 py-4 col-span-2">Termin topilmadi.</p>'; },
        docs() {
            document.getElementById('doc-list').innerHTML = db.docs.map(d => `<button onclick="app.render.docSelect('${d.id}')" id="doc-btn-${d.id}" class="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-primary-50 hover:border-primary-500 dark:hover:bg-gray-700 mb-3 font-medium text-gray-700 dark:text-gray-200 transition"><i class="far fa-file-alt text-primary-500 mr-2"></i> ${d.name}</button>`).join('');
            if(db.docs.length) this.docSelect(db.docs[0].id);
        },
        docSelect(id) {
            const t = db.docs.find(d => d.id === id);
            app.activeDoc = t;
            
            document.querySelectorAll('#doc-list button').forEach(b => b.classList.remove('bg-primary-50', 'border-primary-500', 'dark:bg-gray-700', 'text-primary-700'));
            document.getElementById(`doc-btn-${id}`).classList.add('bg-primary-50', 'border-primary-500', 'dark:bg-gray-700', 'text-primary-700');

            document.getElementById('doc-title').innerText = t.name;
            document.getElementById('doc-form').innerHTML = t.fields.map(f => `<div><label class="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">${f.label}</label>${f.type==='textarea'?`<textarea id="df-${f.id}" required rows="4" placeholder="${f.placeholder||''}" class="input-base custom-scrollbar"></textarea>`:`<input type="text" id="df-${f.id}" placeholder="${f.placeholder||''}" required class="input-base">`}</div>`).join('') + `<button type="submit" class="w-full bg-primary-900 text-gold-500 py-3 rounded-lg font-bold mt-6 shadow-md hover:bg-primary-800 transition flex items-center justify-center gap-2"><i class="fas fa-magic"></i> Yaratish</button>`;
            document.getElementById('doc-res-box').classList.add('hidden');
            document.getElementById('doc-form').onsubmit = (e) => {
                e.preventDefault();
                let data = {}; t.fields.forEach(f => data[f.id] = document.getElementById(`df-${f.id}`).value);
                document.getElementById('doc-out').innerText = t.render(data);
                document.getElementById('doc-res-box').classList.remove('hidden');
                app.state.history.add('Hujjat', t.name + ' yaratildi');
                app.ui.toast("Hujjat muvaffaqiyatli yaratildi", "success");
            };
        },
        docAction(type) {
            if(type === 'copy') { navigator.clipboard.writeText(document.getElementById('doc-out').innerText); app.ui.toast("Nusxa olindi", "success"); }
            if(type === 'pdf') { window.print(); app.state.history.add('Hujjat', 'Chop etildi / PDF'); }
        },
        profile() {
            const favs = JSON.parse(localStorage.getItem('legalUzFavs') || '[]');
            const hist = JSON.parse(localStorage.getItem('legalUzHistory') || '[]');
            document.getElementById('prof-favs').innerHTML = favs.length ? favs.map(f => `<div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900/50"><div class="flex flex-col"><span class="text-xs font-bold text-gray-400 uppercase">${f.type}</span><span class="text-sm font-medium text-gray-800 dark:text-gray-200">${f.title}</span></div><button onclick="app.state.favs.toggle('${f.type}', '${f.id}', '${f.title}')" class="text-gold-500 hover:text-red-500 transition"><i class="fas fa-times"></i></button></div>`).join('') : '<p class="text-gray-500 text-sm">Saqlangan ma\'lumotlar yo\'q</p>';
            document.getElementById('prof-hist').innerHTML = hist.length ? hist.map(h => `<div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-600 dark:text-gray-300"><span class="font-bold text-gray-400 uppercase mr-2 text-xs">${h.type}</span> ${h.text}</div>`).join('') : '<p class="text-gray-500 text-sm">Tarix bo\'sh</p>';
        }
    },

    tests: {
        active: false, cur: 0, score: 0,
        start() { this.active = true; this.cur = 0; this.score = 0; this.render(); },
        render() {
            const b = document.getElementById('test-box');
            if (this.cur >= db.tests.length) {
                const perc = Math.round((this.score/db.tests.length)*100);
                b.innerHTML = `<div class="text-center py-10"><i class="fas fa-trophy text-6xl text-gold-500 mb-6"></i><h3 class="text-3xl font-bold dark:text-white mb-2">Natija: <span class="text-primary-600">${perc}%</span></h3><p class="mb-8 text-gray-500 text-lg">${db.tests.length} tadan ${this.score} ta to'g'ri javob</p><button onclick="app.tests.start()" class="bg-primary-900 text-gold-500 px-8 py-3 rounded-lg font-bold hover:bg-primary-800 transition">Qayta ishlash</button></div>`;
                app.state.history.add('Test', `Natija: ${perc}%`); return;
            }
            const q = db.tests[this.cur];
            b.innerHTML = `<div class="flex justify-between items-center mb-6"><div class="text-sm font-bold text-gray-400 tracking-wide uppercase">SAVOL ${this.cur+1} / ${db.tests.length}</div></div><h3 class="text-xl font-serif font-bold mb-8 text-gray-900 dark:text-white">${q.q}</h3><div class="space-y-4">${q.opts.map((o,i) => `<button onclick="app.tests.answer(${i})" class="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700 font-medium text-gray-700 dark:text-gray-200 transition">${o}</button>`).join('')}</div>`;
        },
        answer(idx) {
            const q = db.tests[this.cur];
            const isOk = idx === q.ans;
            if(isOk) this.score++;
            document.getElementById('test-box').innerHTML = `<div class="py-6"><div class="flex items-center gap-4 mb-6"><div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isOk?'bg-green-100 text-green-600':'bg-red-100 text-red-600'}"><i class="fas ${isOk?'fa-check':'fa-times'}"></i></div><h3 class="text-2xl font-bold ${isOk?'text-green-600':'text-red-600'}">${isOk?'To\'g\'ri!':'Xato!'}</h3></div><div class="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"><p class="text-gray-800 dark:text-gray-200 leading-relaxed">${q.exp}</p></div><button onclick="app.tests.cur++; app.tests.render()" class="bg-primary-900 text-gold-500 px-8 py-3 rounded-lg font-bold hover:bg-primary-800 transition">Keyingisi <i class="fas fa-arrow-right ml-2"></i></button></div>`;
        }
    },

    audio: {
        s: window.speechSynthesis,
        play(txt, title="O'qilmoqda") {
            this.stop(); 
            if(!this.s) return app.ui.toast("Brauzer audioni qo'llab-quvvatlamaydi", "error");
            document.getElementById('audio-title').innerText = title;
            document.getElementById('audio-player').classList.remove('translate-y-24');
            const u = new SpeechSynthesisUtterance(txt);
            // using tr-TR as uz-UZ fallback in standard speech API, or ru-RU for russian
            u.lang = localStorage.getItem('lang') === 'ru' ? 'ru-RU' : 'tr-TR'; 
            u.onend = () => this.stop();
            this.s.speak(u);
        },
        pause() { this.s.pause(); }, 
        resume() { this.s.resume(); },
        stop() { this.s.cancel(); document.getElementById('audio-player').classList.add('translate-y-24'); }
    },

    state: {
        favs: {
            check(type, id) {
                let f = JSON.parse(localStorage.getItem('legalUzFavs') || '[]');
                return f.some(x => x.id == id && x.type == type);
            },
            toggle(type, id, title) {
                let f = JSON.parse(localStorage.getItem('legalUzFavs') || '[]');
                if(this.check(type, id)) { 
                    f = f.filter(x => !(x.id == id && x.type == type)); 
                    app.ui.toast("Saqlanganlardan olib tashlandi"); 
                } else { 
                    f.push({type, id, title}); 
                    app.ui.toast("Muvaffaqiyatli saqlandi!", "success"); 
                }
                localStorage.setItem('legalUzFavs', JSON.stringify(f));
                if(app.view === 'profile') app.render.profile();
                if(app.view === 'const') app.render.constitution(); // re-render icons
            }
        },
        history: {
            add(type, text) {
                let h = JSON.parse(localStorage.getItem('legalUzHistory') || '[]');
                h.unshift({type, text, time: Date.now()}); 
                if(h.length > 50) h.pop();
                localStorage.setItem('legalUzHistory', JSON.stringify(h));
            }
        }
    },

    i18n: {
        dict: {
            uz: { know_rights: "Huquqingizni biling.", home_desc: "O'zbekistonning professional yuridik portali. Qonunlar, hujjatlar va AI yordamchisi bir joyda.", search_placeholder: "Huquqiy qidiruv...", nav_home: "Bosh sahifa", nav_ai: "AI Yordamchi", nav_const: "Konstitutsiya", nav_codes: "Kodekslar", nav_docs: "Hujjatlar", nav_dict: "Lug'at", nav_test: "Testlar", nav_profile: "Profil / Tarix", audio_reading: "O'qilmoqda" },
            ru: { know_rights: "Знайте свои права.", home_desc: "Профессиональный юридический портал Узбекистана. Законы, документы и ИИ-помощник.", search_placeholder: "Правовой поиск...", nav_home: "Главная", nav_ai: "ИИ Помощник", nav_const: "Конституция", nav_codes: "Кодексы", nav_docs: "Документы", nav_dict: "Словарь", nav_test: "Тесты", nav_profile: "Профиль / История", audio_reading: "Чтение" },
            en: { know_rights: "Know your rights.", home_desc: "Professional legal portal of Uzbekistan. Laws, documents, and AI assistant in one place.", search_placeholder: "Legal search...", nav_home: "Home", nav_ai: "AI Assistant", nav_const: "Constitution", nav_codes: "Codes", nav_docs: "Documents", nav_dict: "Dictionary", nav_test: "Tests", nav_profile: "Profile / History", audio_reading: "Reading" }
        },
        apply() {
            const l = localStorage.getItem('lang') || 'uz';
            document.querySelectorAll('[data-i18n]').forEach(el => el.innerText = this.dict[l][el.getAttribute('data-i18n')] || el.innerText);
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = this.dict[l][el.getAttribute('data-i18n-placeholder')] || el.placeholder);
            document.getElementById('lang-switcher').value = l;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
