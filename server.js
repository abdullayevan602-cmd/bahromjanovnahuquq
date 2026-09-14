import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to avoid crashing if API key is missing during startup
let ai = null;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
}

app.post('/api/chat', async (req, res) => {
    try {
        if (!ai) {
            return res.status(500).json({ 
                error: "GEMINI_API_KEY sozlanmagan. Iltimos, sozlamalar orqali API kalitni kiriting." 
            });
        }

        const { message, history } = req.body;

        const systemInstruction = `Siz "LEGAL UZ" ilovasining professional sun'iy intellekt yuridik yordamchisisiz. 
Siz O'zbekiston Respublikasi qonunchiligi asosida maslahat berasiz.
MAJBURIY QOIDALAR:
1. Hech qachon noqonuniy harakatlarni, jinoyatni yashirishni, hujjatlarni qalbakilashtirishni o'rgatmang. Agar shunday savol berilsa, qonuniy va xavfsiz alternativani tushuntiring.
2. Har bir yuridik javobning oxirida doim quyidagi matnni qo'shing: "Bu umumiy huquqiy ma'lumot bo'lib, individual yuridik maslahat o'rnini bosmaydi."
3. Iloji boricha aniq qonun, kodeks va moddalarni ko'rsatib, sodda tilda tushuntiring.
4. Qanday harakat qilish kerakligini bosqichma-bosqich (qadam-baqadam) tushuntiring.
5. Zarur hujjatlar ro'yxatini taqdim eting.
6. Javoblaringiz faqat O'zbek tilida (Lotin yozuvida) bo'lsin.`;

        // Format history for Gemini SDK
        const contents = [];
        
        if (history && history.length > 0) {
            history.forEach(msg => {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            });
        }
        
        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3, // Low temperature for more factual, legal tone
            }
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring." });
    }
});

// For any other route, serve index.html (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`LEGAL UZ server running on port ${PORT}`);
});
