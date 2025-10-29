const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Missing required parameters: text and targetLang' });
    }
    try {
        const fetch = await import('node-fetch');
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        const response = await fetch.default(apiUrl);
        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails);
        }

        res.json({ translation: data.responseData.translatedText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch translation.' });
    }
});

app.post('/reverse', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Missing required parameter: text' });
    }
    const reversedText = text.split('').reverse().join('');
    res.json({ reversedText: reversedText });
});

app.listen(port, () => {
    console.log(`API server is running.`);
});
