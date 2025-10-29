document.addEventListener('DOMContentLoaded', () => {
    const startupAnimation = document.getElementById('startup-animation');
    const mainContent = document.getElementById('main-content');
    const morphText = document.querySelector('.morph-text');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const languageDropdown = document.getElementById('language-dropdown');
    const translateButton = document.getElementById('translate-button');
    const switchLanguagesButton = document.getElementById('switch-languages');

    const apiUrl = 'https://api.livelytranslate.cfd';

    const languages = [
        "Translate lively.",
        "Traducir animadamente.",
        "Traduire vivement.",
        "翻译得活泼.",
        "Переводите оживленно."
    ];

    let currentLanguageIndex = 0;
    const morphInterval = setInterval(() => {
        currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
        morphText.innerHTML = languages[currentLanguageIndex].replace('lively.', '<span class="lively-text">lively.</span>');
    }, 1000);

    setTimeout(() => {
        clearInterval(morphInterval);
        startupAnimation.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.style.display = 'flex';
    }, 5000);

    const languageOptions = {
        "Spanish": "es",
        "French": "fr",
        "German": "de",
        "Chinese (Simplified)": "zh-CN",
        "Japanese": "ja",
        "Russian": "ru",
        "Italian": "it",
        "Portuguese": "pt",
        "Korean": "ko",
        "Arabic": "ar",
        "Hindi": "hi",
        "Reverse Text": "reverse"
    };

    for (const [name, code] of Object.entries(languageOptions)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        languageDropdown.appendChild(option);
    }

    const handleTranslation = async () => {
        const textToTranslate = inputText.value;
        const targetLanguage = languageDropdown.value;

        if (textToTranslate.trim() === "") {
            outputText.value = "";
            return;
        }

        let endpoint = '';
        let body = {};
        
        if (targetLanguage === 'reverse') {
            endpoint = '/reverse';
            body = { text: textToTranslate };
        } else {
            endpoint = '/translate';
            body = { text: textToTranslate, targetLang: targetLanguage };
        }

        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            outputText.value = data.translation || data.reversedText;
        } catch (error) {
            outputText.value = 'Error: Could not connect to the translation service.';
        }
    };

    translateButton.addEventListener('click', handleTranslation);

    switchLanguagesButton.addEventListener('click', () => {
        const tempText = inputText.value;
        inputText.value = outputText.value;
        outputText.value = tempText;
    });
});
