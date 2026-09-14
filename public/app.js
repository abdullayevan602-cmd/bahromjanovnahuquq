const app = {
    state: {
        view: 'home',
        theme: localStorage.getItem('theme') || 'light',
        lang: localStorage.getItem('lang') || 'uz',
        favorites: JSON.parse(localStorage.getItem('legalUzFavs')) || [],
        history: JSON.parse(localStorage.getItem('legalUzHistory')) || []
    },

    init() {
        this.ui.initTheme();
        this.nav.init();
        this.events.init();
        
        // Initial render for views that need data immediately
        this.render.home();
        this.render.constitution();
        this.render.codes();
        this.render.dictionary();
        this.docGen.renderSelect();
    },

    events: {
        init() {
            document.getElementById('theme-toggle').addEventListener('click', () => app.ui.toggleTheme());
            document.getElementById('lang-switcher').addEventListener('change', (e) => {
                app.state.lang = e.target.value;
                localStorage.setItem('lang', app.state.lang);
                app.ui.toast("Til o'zgartirildi (Demo)");
            });
            document.getElementById('mobile-menu-btn').addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('-translate-x-full');
            });
            document.getElementById('global-search').addEventListener('keypress', (e) => {
                if(e.key === 'Enter' && e.target.value.trim() !== '') {
                    app.nav.goTo('ai');
                    document.getElementById('ai-input').value = `Qidiruv: ${e.target.value}`;
                    aiController.sendMessage();
                    e.target.value = '';
                }
            });
        }
    },

    ui: {
        initTheme() {
            if (app.state.theme === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                app.state.theme = 'dark';
            }
        },
        toggleTheme() {
            document.documentElement.classList.toggle('dark');
            app.state.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', app.state.theme);
        },
        toast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            
            let colors = type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
                         type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 
                         'bg-primary-50 text-primary-900 border-primary-200 dark:bg-gray-800 dark:text-white dark:border-gray-700';
                         
            let icon = type === 'error' ? 'fa-exclamation-circle text-red-500' :
                       type === 'success' ? 'fa-check-circle text-green-500' :
                       'fa-info-circle text-primary-500';

            toast.className = `toast-enter flex items-center gap-3 p-4 rounded-xl border shadow-lg ${colors}`;
            toast.innerHTML = `<i class="fas ${icon}"></i><p class="text-sm font-medium">${message}</p>`;
            
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.3s';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    },

    nav: {
        items: [
            { id: 'home', icon: 'fa-home', label: 'Bosh sahifa' },
            { id: 'constitution', icon: 'fa-book-open', label: 'Konstitutsiya' },
            { id: 'codes', icon: 'fa-scale-balanced', label: 'Kodekslar' },
            { id: 'ai', icon: 'fa-robot', label: 'AI Yordamchi' },
            { id: 'docs', icon: 'fa-file-signature', label: 'Hujjatlar' },
            { id: 'dictionary', icon: 'fa-spell-check', label: 'Lug\'at' },
            { id: 'tests', icon: 'fa-check-double', label: 'Testlar' },
            { id: 'profile', icon: 'fa-user-circle', label: 'Profil / Tarix' }
        ],
        init() {
            const menu = document.getElementById('nav-menu');
            menu.innerHTML = this.items.map(item => `
                <a href="#" onclick="app.nav.goTo('${item.id}')" id="nav-${item.id}" 
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <i class="fas ${item.icon} w-5 text-center text-lg"></i>
                    <span class="font-medium">${item.label}</span>
                </a>
            `).join('');
            
            // Build view containers
            const viewsContainer = document.getElementById('views');
            this.items.forEach(item => {
                const section = document.createElement('section');
                section.id = `view-${item.id}`;
                section.className = 'view-section hidden animate-fade-in flex-col h-full';
                viewsContainer.appendChild(section);
            });

            // Initialize specific view layouts
            this.buildViewLayouts();
            this.goTo(app.state.view);
        },
        goTo(id) {
            document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
            document.getElementById(`view-${id}`).classList.remove('hidden');
            document.getElementById(`view-${id}`).classList.add('flex'); // Because we use flex-col
            
            document.querySelectorAll('#nav-menu a').forEach(el => {
                el.classList.remove('bg-primary-50', 'text-primary-600', 'dark:bg-gray-700', 'dark:text-primary-400');
            });
            const activeNav = document.getElementById(`nav-${id}`);
            if(activeNav) activeNav.classList.add('bg-primary-50', 'text-primary-600', 'dark:bg-gray-700', 'dark:text-primary-400');

            app.state.view = id;
            document.getElementById('main-scroll-area').scrollTop = 0;
            
            if (window.innerWidth < 1024) document.getElementById('sidebar').classList.add('-translate-x-full');
            
            if(id === 'profile') app.render.profile();
            if(id === 'tests' && !document.getElementById('test-container').innerHTML) app.tests.start();
        },
        buildViewLayouts() {
            // Home
            document.getElementById('view-home').innerHTML = `
                <div class="mb-10 text-center lg:text-left">
                    <h1 class="text-4xl md:text-5xl font-serif font-black text-gray-900 dark:text-white mb-4">Huquqingizni biling.</h1>
                    <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">Professional yuridik portal. Qonunlar, kodekslar, shartnomalar va sun'iy intellekt yordamchisi bir joyda.</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="home-grid"></div>
            `;

            // Constitution
            document.getElementById('view-constitution').innerHTML = `
                <div class="mb-8">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white">O'zbekiston Respublikasi Konstitutsiyasi</h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">Barcha moddalar, sodda tilda tushuntirish va audio bilan.</p>
                </div>
                <div class="relative mb-8">
                    <input type="text" id="const-search" placeholder="Moddani qidirish..." onkeyup="app.render.constitution(this.value)" class="input-base pl-12">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div id="const-list" class="space-y-6"></div>
            `;

            // Codes
            document.getElementById('view-codes').innerHTML = `
                <div class="mb-8">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white">Kodekslar va Qonunlar</h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">Asosiy huquq sohalari bo'yicha hujjatlar to'plami.</p>
                </div>
                <div id="codes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            `;

            // AI Chat
            document.getElementById('view-ai').innerHTML = `
                <div class="mb-6 shrink-0">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <div class="w-10 h-10 rounded bg-primary-900 text-gold-500 flex items-center justify-center text-xl shadow-md"><i class="fas fa-robot"></i></div>
                        AI Yurist
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">Vaziyatingizni tushuntiring, men qonuniy yechim topishga yordam beraman.</p>
                </div>
                <div class="flex-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shadow-inner">
                    <div id="ai-chat-box" class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
                        <div class="flex items-start gap-4 mb-6">
                            <div class="w-10 h-10 rounded-full bg-primary-900 text-gold-500 flex items-center justify-center shrink-0 border border-gold-500/30">
                                <i class="fas fa-scale-balanced"></i>
                            </div>
                            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
                                <p class="text-sm">Assalomu alaykum! Men LEGAL UZ sun'iy intellektiman. Sizga qanday huquqiy masalada yordam bera olaman?</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0">
                        <div class="relative flex items-end gap-2">
                            <button id="btn-mic" onclick="aiController.stt.toggle()" class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-600 transition shrink-0 flex items-center justify-center text-xl">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <textarea id="ai-input" rows="1" placeholder="Savolingizni yozing..." 
                                class="input-base resize-none custom-scrollbar min-h-[48px] max-h-32 py-3"
                                oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px'"
                                onkeypress="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); aiController.sendMessage(); }"></textarea>
                            <button onclick="aiController.sendMessage()" class="w-12 h-12 rounded-xl bg-primary-900 text-gold-500 hover:bg-primary-800 transition shrink-0 flex items-center justify-center text-xl shadow-md">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Docs Generator
            document.getElementById('view-docs').innerHTML = `
                <div class="mb-8 shrink-0">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white">Hujjat Generatori</h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">Kerakli shablonni tanlang va ma'lumotlarni kiriting.</p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                    <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto custom-scrollbar">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-4">Shablonlar</h3>
                        <div id="doc-select-list" class="space-y-2"></div>
                    </div>
                    <div class="lg:col-span-2 flex flex-col gap-6 overflow-y-auto custom-scrollbar h-full pb-10">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h3 id="doc-form-title" class="font-bold text-xl mb-6 text-primary-900 dark:text-primary-400"></h3>
                            <form id="doc-form" class="space-y-4"></form>
                        </div>
                        <div id="doc-result-box" class="hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <div class="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <h3 class="font-bold text-lg">Tayyor Hujjat</h3>
                                <div class="flex gap-2">
                                    <button onclick="app.docGen.copy()" class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 hover:text-primary-600 transition flex items-center justify-center" title="Nusxa olish"><i class="fas fa-copy"></i></button>
                                    <button onclick="app.docGen.download()" class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 hover:text-primary-600 transition flex items-center justify-center" title="TXT yuklash"><i class="fas fa-download"></i></button>
                                    <button onclick="window.print()" class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 hover:text-primary-600 transition flex items-center justify-center" title="Chop etish"><i class="fas fa-print"></i></button>
                                </div>
                            </div>
                            <pre id="doc-output" class="font-serif text-sm bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200"></pre>
                        </div>
                    </div>
                </div>
            `;

            // Dictionary
            document.getElementById('view-dictionary').innerHTML = `
                <div class="mb-8">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white">Huquqiy Lug'at</h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">Yuridik terminlarning sodda tildagi izohlari.</p>
                </div>
                <div class="relative mb-8">
                    <input type="text" placeholder="Terminni qidirish..." onkeyup="app.render.dictionary(this.value)" class="input-base pl-12">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div id="dict-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            `;

            // Tests
            document.getElementById('view-tests').innerHTML = `
                <div class="mb-8">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white">Huquqiy Testlar</h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">O'z bilimingizni sinab ko'ring.</p>
                </div>
                <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                    <div id="test-container"></div>
                </div>
            `;

            // Profile & History
            document.getElementById('view-profile').innerHTML = `
                <div class="mb-8">
                    <h2 class="text-3xl font-serif font-black text-gray-900 dark:text-white">Profil va Tarix</h2>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h3 class="font-bold text-xl mb-4 flex items-center gap-2"><i class="fas fa-star text-gold-500"></i> Saqlanganlar (Favoritlar)</h3>
                        <div id="profile-favs" class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"></div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h3 class="font-bold text-xl mb-4 flex items-center gap-2"><i class="fas fa-history text-primary-500"></i> O'qish Tarixi</h3>
                        <div id="profile-history" class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"></div>
                    </div>
                </div>
            `;
        }
    },

    render: {
        home() {
            const grid = document.getElementById('home-grid');
            const items = app.nav.items.filter(i => i.id !== 'home' && i.id !== 'profile');
            grid.innerHTML = items.map(i => `
                <div onclick="app.nav.goTo('${i.id}')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover-card group">
                    <div class="w-14 h-14 rounded-xl bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <i class="fas ${i.icon}"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${i.label}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Ushbu bo'limga o'tish uchun bosing &rarr;</p>
                </div>
            `).join('');
        },
        constitution(query = '') {
            const list = document.getElementById('const-list');
            const q = query.toLowerCase();
            
            let html = legalData.constitution.filter(a => 
                a.text.toLowerCase().includes(q) || 
                a.number.toString().includes(q) || 
                a.title.toLowerCase().includes(q)
            ).map(a => {
                const isFav = app.favorites.has('const', a.id);
                return `
                <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm group">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-primary-900 dark:text-primary-400">${a.number}-modda. <span class="font-medium text-gray-700 dark:text-gray-300">${a.title}</span></h3>
                        <div class="flex gap-2">
                            <button onclick="app.audio.play('${a.text.replace(/'/g, "\\'")}', '${a.number}-modda')" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-primary-500 hover:bg-primary-50 transition flex items-center justify-center" title="Eshitish"><i class="fas fa-volume-up"></i></button>
                            <button onclick="app.favorites.toggle('const', ${a.id}, '${a.number}-modda')" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 ${isFav ? 'text-gold-500' : 'text-gray-500'} hover:text-gold-500 hover:bg-gold-50 transition flex items-center justify-center" title="Saqlash"><i class="fas fa-star"></i></button>
                        </div>
                    </div>
                    <p class="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">${a.text}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div class="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800/50">
                            <h4 class="text-sm font-bold text-primary-800 dark:text-primary-300 mb-2 flex items-center gap-2"><i class="fas fa-info-circle"></i> Oddiy tilda</h4>
                            <p class="text-sm text-gray-700 dark:text-gray-300">${a.simple_text}</p>
                        </div>
                        <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50">
                            <h4 class="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2"><i class="fas fa-lightbulb"></i> Amaliy misol</h4>
                            <p class="text-sm text-gray-700 dark:text-gray-300">${a.example}</p>
                        </div>
                    </div>
                </div>
            `}).join('');

            list.innerHTML = html || `<p class="text-gray-500 text-center py-8">Hech narsa topilmadi.</p>`;
        },
        codes() {
            const grid = document.getElementById('codes-grid');
            grid.innerHTML = legalData.codes.map(c => `
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover-card flex items-start gap-4">
                    <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0 text-xl"><i class="fas ${c.icon}"></i></div>
                    <div>
                        <h4 class="font-bold text-gray-900 dark:text-white">${c.title}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${c.desc}</p>
                        <button onclick="app.ui.toast('Bu bo\\'lim tez orada ma\\'lumotlar bilan to\\'ldiriladi')" class="text-xs text-primary-600 dark:text-primary-400 font-bold mt-2 uppercase tracking-wide">Ko'rish</button>
                    </div>
                </div>
            `).join('');
        },
        dictionary(query = '') {
            const list = document.getElementById('dict-list');
            const q = query.toLowerCase();
            let html = legalData.dictionary.filter(d => 
                d.term.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
            ).map(d => `
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-lg text-primary-900 dark:text-primary-400">${d.term}</h4>
                        <button onclick="app.audio.play('${d.desc}', '${d.term}')" class="text-gray-400 hover:text-primary-500"><i class="fas fa-volume-up"></i></button>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300">${d.desc}</p>
                </div>
            `).join('');
            list.innerHTML = html || `<p class="text-gray-500 py-4 col-span-2">Termin topilmadi.</p>`;
        },
        profile() {
            const favs = document.getElementById('profile-favs');
            const hist = document.getElementById('profile-history');
            
            favs.innerHTML = app.state.favorites.length ? app.state.favorites.map(f => `
                <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <div class="truncate pr-4"><span class="text-xs font-bold text-gray-400 uppercase mr-2">${f.type}</span><span class="text-sm text-gray-800 dark:text-gray-200 truncate">${f.title}</span></div>
                    <button onclick="app.favorites.toggle('${f.type}', '${f.id}', '${f.title}')" class="text-gold-500 hover:text-red-500"><i class="fas fa-times"></i></button>
                </div>
            `).join('') : '<p class="text-sm text-gray-500">Saqlangan ma\'lumotlar yo\'q.</p>';

            hist.innerHTML = app.state.history.length ? app.state.history.map(h => `
                <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-600 dark:text-gray-300">
                    <span class="text-xs font-bold text-gray-400 uppercase mr-2">${h.type}</span> ${h.text}
                </div>
            `).join('') : '<p class="text-sm text-gray-500">Tarix bo\'sh.</p>';
        }
    },

    docGen: {
        selected: null,
        renderSelect() {
            const list = document.getElementById('doc-select-list');
            list.innerHTML = legalData.templates.map(t => `
                <button onclick="app.docGen.select('${t.id}')" id="doc-btn-${t.id}" class="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700 transition font-medium text-sm text-gray-700 dark:text-gray-200">
                    <i class="far fa-file-alt mr-2 text-primary-500"></i> ${t.name}
                </button>
            `).join('');
            if(legalData.templates.length > 0) this.select(legalData.templates[0].id);
        },
        select(id) {
            this.selected = legalData.templates.find(t => t.id === id);
            
            document.querySelectorAll('#doc-select-list button').forEach(b => b.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-gray-700', 'text-primary-700'));
            const btn = document.getElementById(`doc-btn-${id}`);
            if(btn) btn.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-gray-700', 'text-primary-700');

            document.getElementById('doc-form-title').innerText = this.selected.name;
            const form = document.getElementById('doc-form');
            form.innerHTML = this.selected.fields.map(f => `
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">${f.label}</label>
                    ${f.type === 'textarea' 
                        ? `<textarea id="df-${f.id}" required rows="4" placeholder="${f.placeholder||''}" class="input-base custom-scrollbar"></textarea>`
                        : `<input type="text" id="df-${f.id}" required placeholder="${f.placeholder||''}" class="input-base">`
                    }
                </div>
            `).join('') + `
                <button type="submit" class="w-full bg-primary-900 hover:bg-primary-800 text-gold-500 font-bold py-3 rounded-lg shadow-md transition mt-4">
                    <i class="fas fa-magic mr-2"></i> Hujjatni Yaratish
                </button>
            `;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                this.generate();
            };
            
            document.getElementById('doc-result-box').classList.add('hidden');
        },
        generate() {
            const data = {};
            this.selected.fields.forEach(f => {
                data[f.id] = document.getElementById(`df-${f.id}`).value;
            });
            const text = this.selected.render(data);
            document.getElementById('doc-output').innerText = text;
            document.getElementById('doc-result-box').classList.remove('hidden');
            
            app.history.add('document', this.selected.name);
            app.ui.toast("Hujjat muvaffaqiyatli yaratildi!", "success");
        },
        copy() {
            navigator.clipboard.writeText(document.getElementById('doc-output').innerText);
            app.ui.toast("Nusxa olindi!", "success");
        },
        download() {
            const text = document.getElementById('doc-output').innerText;
            const blob = new Blob([text], { type: "text/plain" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${this.selected.name.replace(/\s+/g, '_')}.txt`;
            a.click();
        }
    },

    tests: {
        current: 0,
        score: 0,
        start() {
            this.current = 0;
            this.score = 0;
            this.renderQ();
        },
        renderQ() {
            const c = document.getElementById('test-container');
            if (this.current >= legalData.tests.length) {
                const percent = Math.round((this.score / legalData.tests.length) * 100);
                c.innerHTML = `
                    <div class="text-center py-10">
                        <i class="fas fa-trophy text-6xl text-gold-500 mb-6"></i>
                        <h3 class="text-2xl font-bold mb-2">Test yakunlandi!</h3>
                        <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">Sizning natijangiz: <span class="font-bold text-primary-600">${percent}%</span> (${legalData.tests.length} tadan ${this.score} ta to'g'ri)</p>
                        <button onclick="app.tests.start()" class="bg-primary-900 text-gold-500 px-6 py-2.5 rounded-lg font-bold hover:bg-primary-800 transition">Qayta ishlash</button>
                    </div>
                `;
                app.history.add('test', `Natija: ${percent}%`);
                return;
            }

            const q = legalData.tests[this.current];
            c.innerHTML = `
                <div class="flex justify-between text-sm text-gray-500 font-bold mb-6 tracking-wide">
                    <span>SAVOL ${this.current + 1} / ${legalData.tests.length}</span>
                </div>
                <h3 class="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">${q.question}</h3>
                <div class="space-y-3">
                    ${q.options.map((opt, i) => `
                        <button onclick="app.tests.answer(${i})" class="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-200">${opt}</button>
                    `).join('')}
                </div>
            `;
        },
        answer(idx) {
            const q = legalData.tests[this.current];
            const isCorrect = idx === q.answer;
            if(isCorrect) this.score++;
            
            const c = document.getElementById('test-container');
            c.innerHTML = `
                <div class="py-6">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                            <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        </div>
                        <h3 class="text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}">${isCorrect ? 'To\'g\'ri!' : 'Xato!'}</h3>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">${q.explanation}</p>
                    <button onclick="app.tests.next()" class="bg-primary-900 text-gold-500 px-6 py-2.5 rounded-lg font-bold hover:bg-primary-800 transition w-full md:w-auto">Keyingi savol <i class="fas fa-arrow-right ml-2"></i></button>
                </div>
            `;
        },
        next() {
            this.current++;
            this.renderQ();
        }
    },

    favorites: {
        has(type, id) {
            return app.state.favorites.some(f => f.type === type && f.id == id);
        },
        toggle(type, id, title) {
            const exists = this.has(type, id);
            if (exists) {
                app.state.favorites = app.state.favorites.filter(f => !(f.type === type && f.id == id));
                app.ui.toast("Saqlanganlardan olib tashlandi");
            } else {
                app.state.favorites.push({ type, id, title });
                app.ui.toast("Saqlandi!", "success");
            }
            localStorage.setItem('legalUzFavs', JSON.stringify(app.state.favorites));
            if(app.state.view === 'constitution') app.render.constitution(document.getElementById('const-search').value);
            if(app.state.view === 'profile') app.render.profile();
        }
    },

    history: {
        add(type, text) {
            app.state.history.unshift({ type, text, time: Date.now() });
            if (app.state.history.length > 50) app.state.history.pop();
            localStorage.setItem('legalUzHistory', JSON.stringify(app.state.history));
            if(app.state.view === 'profile') app.render.profile();
        }
    },

    audio: {
        synth: window.speechSynthesis,
        play(text, title = "O'qilmoqda") {
            this.stop();
            if (!this.synth) return app.ui.toast("Brauzeringiz audioni qo'llab-quvvatlamaydi", "error");

            document.getElementById('audio-title').innerText = title;
            document.getElementById('audio-player').classList.remove('translate-y-24');

            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = app.state.lang === 'uz' ? 'tr-TR' : (app.state.lang === 'ru' ? 'ru-RU' : 'en-US'); // tr fallback for uz
            
            ut.onend = () => this.stop();
            this.synth.speak(ut);
        },
        pause() { if (this.synth.speaking) this.synth.pause(); },
        resume() { if (this.synth.paused) this.synth.resume(); },
        stop() {
            this.synth.cancel();
            document.getElementById('audio-player').classList.add('translate-y-24');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
