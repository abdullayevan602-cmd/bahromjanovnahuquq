const aiController = {
    history: [],
    
    async sendMessage() {
        const input = document.getElementById('ai-input');
        const text = input.value.trim();
        if (!text) return;

        this.appendMsg('user', text);
        input.value = '';
        this.scrollToBottom();

        const typingId = 'typing-' + Date.now();
        document.getElementById('ai-chat-box').innerHTML += `
            <div id="${typingId}" class="flex items-start gap-4 mb-6 animate-fade-in">
                <div class="w-10 h-10 rounded-full bg-primary-900 text-gold-500 flex items-center justify-center shrink-0 shadow-md"><i class="fas fa-robot"></i></div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
                    <div class="flex gap-1.5 items-center px-2 py-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                    </div>
                </div>
            </div>`;
        this.scrollToBottom();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: this.history })
            });

            document.getElementById(typingId)?.remove();

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Xatolik yuz berdi');
            }

            const data = await res.json();
            this.appendMsg('model', data.text);
            this.history.push({ role: 'user', text: text }, { role: 'model', text: data.text });
            app.state.history.add('AI Maslahat', text);

        } catch (error) {
            document.getElementById(typingId)?.remove();
            this.appendMsg('model', `<span class="text-red-500 font-medium"><i class="fas fa-exclamation-triangle mr-2"></i> ${error.message}</span>`);
        }
    },

    appendMsg(role, text) {
        const box = document.getElementById('ai-chat-box');
        if (role === 'user') {
            box.innerHTML += `
                <div class="flex items-start gap-4 flex-row-reverse mb-6 animate-fade-in">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center shrink-0 border border-gray-300 dark:border-gray-600"><i class="fas fa-user text-gray-500 dark:text-gray-400"></i></div>
                    <div class="bg-primary-900 text-white rounded-2xl rounded-tr-none p-4 shadow-sm max-w-[85%]"><p class="text-sm leading-relaxed">${text}</p></div>
                </div>`;
        } else {
            let formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-900 dark:text-primary-400">$1</strong>')
                .replace(/\n/g, '<br>');
            let cleanText = text.replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\*/g, '');
            const msgId = Date.now();
            box.innerHTML += `
                <div class="flex items-start gap-4 mb-6 animate-fade-in group">
                    <div class="w-10 h-10 rounded-full bg-primary-900 text-gold-500 flex justify-center items-center shrink-0 shadow-md border border-gold-500/30"><i class="fas fa-scale-balanced"></i></div>
                    <div class="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-5 shadow-sm border border-gray-200 dark:border-gray-700 max-w-[95%] lg:max-w-[85%]">
                        <div class="text-sm prose dark:prose-invert text-gray-800 dark:text-gray-200 leading-relaxed font-serif">${formatted}</div>
                        <div class="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                            <button onclick="app.audio.play('${cleanText}', 'AI Maslahati')" class="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition flex items-center gap-2"><i class="fas fa-volume-up"></i> Eshitish</button>
                            <button onclick="app.state.favs.toggle('ai', '${msgId}', 'AI Javobi')" class="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gold-50 hover:text-gold-600 hover:border-gold-200 transition flex items-center gap-2"><i class="fas fa-star"></i> Saqlash</button>
                        </div>
                    </div>
                </div>`;
        }
        this.scrollToBottom();
    },
    
    scrollToBottom() {
        const box = document.getElementById('ai-chat-box');
        if (box) box.scrollTop = box.scrollHeight;
    },
    
    stt: {
        rec: null, listening: false,
        init() {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SR) {
                this.rec = new SR();
                this.rec.lang = 'uz-UZ';
                this.rec.continuous = false;
                this.rec.interimResults = false;
                
                this.rec.onresult = (e) => {
                    const txt = e.results[0][0].transcript;
                    const input = document.getElementById('ai-input');
                    input.value += (input.value ? ' ' : '') + txt;
                    this.stop();
                };
                
                this.rec.onerror = (e) => {
                    console.error("Speech Recognition Error:", e);
                    app.ui.toast("Mikrofon xatosi yoki ruxsat yo'q", "error");
                    this.stop();
                };
                
                this.rec.onend = () => this.stop();
            }
        },
        toggle() {
            if (!this.rec) this.init();
            if (!this.rec) return app.ui.toast("Brauzer mikrofonga ruxsat bermaydi.", "error");
            this.listening ? this.stop() : this.start();
        },
        start() { 
            this.listening = true; 
            const btn = document.getElementById('btn-mic');
            btn.classList.add('bg-red-100', 'text-red-500', 'animate-pulse', 'border', 'border-red-300'); 
            btn.classList.remove('bg-gray-100', 'text-gray-500');
            this.rec.start(); 
            app.ui.toast("Gapiring...", "info");
        },
        stop() { 
            this.listening = false; 
            const btn = document.getElementById('btn-mic');
            if (btn) {
                btn.classList.remove('bg-red-100', 'text-red-500', 'animate-pulse', 'border', 'border-red-300');
                btn.classList.add('bg-gray-100', 'text-gray-500');
            }
            try { this.rec.stop(); } catch(e){} 
        }
    }
};
