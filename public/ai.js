const aiController = {
    chatHistory: [],
    
    async sendMessage() {
        const input = document.getElementById('ai-input');
        const text = input.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        input.value = '';
        this.scrollToBottom();

        // Show typing indicator
        const typingId = 'typing-' + Date.now();
        const chatBox = document.getElementById('ai-chat-box');
        chatBox.innerHTML += `
            <div id="${typingId}" class="flex items-start gap-4 mb-4">
                <div class="w-10 h-10 rounded-full bg-primary-900 text-gold-500 flex items-center justify-center shrink-0 border border-gold-500/30">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <i class="fas fa-ellipsis-h fa-fade text-gray-400"></i>
                </div>
            </div>
        `;
        this.scrollToBottom();

        try {
            // Check if backend is available by making the request
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: this.chatHistory })
            });

            document.getElementById(typingId).remove();

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Server error');
            }

            const data = await response.json();
            this.appendMessage('model', data.text);
            this.chatHistory.push({ role: 'user', text: text });
            this.chatHistory.push({ role: 'model', text: data.text });
            app.history.add('ai', text);

        } catch (error) {
            document.getElementById(typingId)?.remove();
            console.error(error);
            this.appendMessage('model', `Xatolik yuz berdi: ${error.message}\n\n*Agar API kalit qo'yilmagan bo'lsa, javob berish funksiyasi ishlamaydi.*`);
        }
    },

    appendMessage(role, text) {
        const chatBox = document.getElementById('ai-chat-box');
        const isUser = role === 'user';
        
        let html = '';
        if (isUser) {
            html = `
                <div class="flex items-start gap-4 flex-row-reverse mb-6 animate-fade-in">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                        <i class="fas fa-user text-gray-500 dark:text-gray-400"></i>
                    </div>
                    <div class="bg-primary-900 text-white rounded-2xl rounded-tr-none p-4 shadow-sm max-w-[85%] lg:max-w-[75%]">
                        <p class="text-sm">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                    </div>
                </div>
            `;
        } else {
            // Format bold and lists simply
            let formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\*/g, '<br>•')
                .replace(/\n/g, '<br>');

            html = `
                <div class="flex items-start gap-4 mb-6 animate-fade-in group">
                    <div class="w-10 h-10 rounded-full bg-primary-900 text-gold-500 flex items-center justify-center shrink-0 border border-gold-500/30">
                        <i class="fas fa-scale-balanced"></i>
                    </div>
                    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[95%] lg:max-w-[85%] relative">
                        <div class="text-sm prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                            ${formattedText}
                        </div>
                        <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button onclick="app.audio.play('${text.replace(/'/g, "\\'").replace(/\n/g, ' ')}', 'AI Javobi')" class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-full transition flex items-center gap-1">
                                <i class="fas fa-volume-up"></i> Eshitish
                            </button>
                            <button onclick="app.favorites.toggle('ai', '${Date.now()}', '${text.replace(/'/g, "\\'").replace(/\n/g, ' ')}')" class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gold-50 dark:hover:bg-gold-900/30 text-gold-600 dark:text-gold-400 px-3 py-1.5 rounded-full transition flex items-center gap-1">
                                <i class="fas fa-star"></i> Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        chatBox.innerHTML += html;
        this.scrollToBottom();
    },

    scrollToBottom() {
        const box = document.getElementById('ai-chat-box');
        if(box) box.scrollTop = box.scrollHeight;
    },

    // Speech to Text
    stt: {
        recognition: null,
        isListening: false,
        init() {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SR) {
                this.recognition = new SR();
                this.recognition.lang = 'uz-UZ';
                this.recognition.onresult = (e) => {
                    const text = e.results[0][0].transcript;
                    const input = document.getElementById('ai-input');
                    input.value += (input.value ? ' ' : '') + text;
                    this.stop();
                };
                this.recognition.onerror = () => this.stop();
                this.recognition.onend = () => this.stop();
            }
        },
        toggle() {
            if (!this.recognition) this.init();
            if (!this.recognition) return app.ui.toast("Brauzeringiz mikrofonga ruxsat bermaydi.", "error");

            if (this.isListening) this.stop();
            else this.start();
        },
        start() {
            this.isListening = true;
            document.getElementById('btn-mic').classList.add('text-red-500', 'animate-pulse');
            try { this.recognition.start(); } catch(e){}
        },
        stop() {
            this.isListening = false;
            document.getElementById('btn-mic')?.classList.remove('text-red-500', 'animate-pulse');
            try { this.recognition.stop(); } catch(e){}
        }
    }
};
