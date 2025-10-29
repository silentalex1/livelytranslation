document.addEventListener('DOMContentLoaded', () => {
    const startupAnimation = document.getElementById('startup-animation');
    const mainContent = document.getElementById('main-content');
    const animatedText = document.getElementById('animated-text');
    const translateText = document.querySelector('.translate-text');
    const livelyText = document.querySelector('.lively-text');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const translateButton = document.getElementById('translate-button');
    const switchLanguagesButton = document.getElementById('switch-languages');
    const languageDropdown = document.getElementById('language-dropdown');

    const languages = [
        { text: 'Translate lively.', lang: 'English' },
        { text: 'Traducir animadamente.', lang: 'Spanish' },
        { text: 'Traduire vivement.', lang: 'French' },
        { text: 'Lebhaft übersetzen.', lang: 'German' },
        { text: '生き生きと翻訳します。', lang: 'Japanese' }
    ];
    let currentLanguageIndex = 0;

    function morphText() {
        currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
        const newText = languages[currentLanguageIndex].text;
        
        animatedText.style.opacity = 0;
        
        setTimeout(() => {
            const splitIndex = newText.lastIndexOf(' ');
            if (currentLanguageIndex === 0) {
                translateText.textContent = 'Translate ';
                livelyText.textContent = 'lively.';
            } else {
                translateText.textContent = newText;
                livelyText.textContent = '';
            }
            animatedText.style.opacity = 1;
        }, 500);
    }

    const morphInterval = setInterval(morphText, 1500);

    setTimeout(() => {
        clearInterval(morphInterval);
        mainContent.style.display = 'flex';
    }, 7000);

    function getTranslation(text, targetLang) {
        // Placeholder for a real translation API
        const translations = {
            'es': 'Esto es una traducción simulada.',
            'fr': 'Ceci est une traduction simulée.',
            'de': 'Dies ist eine simulierte Übersetzung.',
            'ja': 'これはシミュレートされた翻訳です。',
            'ko': '이것은 시뮬레이션된 번역입니다.'
        };
        return `"${text}" translated to ${targetLang} (simulated): ${translations[targetLang] || 'Translation not available.'}`;
    }
    
    translateButton.addEventListener('click', () => {
        const textToTranslate = inputText.value;
        const targetLanguage = languageDropdown.value;
        if (textToTranslate.trim() === '') {
            outputText.value = '';
            return;
        }
        const translatedText = getTranslation(textToTranslate, targetLanguage);
        outputText.value = translatedText;
    });

    switchLanguagesButton.addEventListener('click', () => {
        const temp = inputText.value;
        inputText.value = outputText.value.startsWith('"') ? outputText.value.substring(outputText.value.indexOf(': ') + 2) : outputText.value;
        outputText.value = temp;

        const inputLang = inputText.placeholder.includes('English') ? 'en' : languageDropdown.value;
        const outputLang = languageDropdown.value;

        languageDropdown.value = inputLang;
        inputText.placeholder = `Enter ${languageDropdown.options[languageDropdown.selectedIndex].text} text...`;
    });
});
