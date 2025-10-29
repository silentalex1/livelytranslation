document.addEventListener('DOMContentLoaded', () => {
    const startupAnimation = document.getElementById('startup-animation');
    const animatedText = document.getElementById('animated-text');
    const mainContent = document.getElementById('main-content');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const translateButton = document.getElementById('translate-button');
    const switchLanguagesButton = document.getElementById('switch-languages');
    const languageDropdown = document.getElementById('language-dropdown');
    const sourceLangHeader = document.getElementById('source-lang-header');
    const leavesContainer = document.querySelector('.leaves-container');

    let sourceLang = 'auto';
    let targetLang = 'es';
    let detectedLang = '';

    const animationPhrases = [
        `Translate <span class="lively-text">lively.</span>`,
        `Traducir <span class="lively-text">fluidamente.</span>`,
        `Traduire <span class="lively-text">avec aisance.</span>`,
        `Übersetzen <span class="lively-text">lebendig.</span>`,
        `翻訳する <span class="lively-text">生き生きと.</span>`
    ];
    let phraseIndex = 0;

    const runStartupAnimation = () => {
        const interval = setInterval(() => {
            phraseIndex++;
            if (phraseIndex < animationPhrases.length) {
                animatedText.style.opacity = 0;
                setTimeout(() => {
                    animatedText.innerHTML = animationPhrases[phraseIndex];
                    animatedText.style.opacity = 1;
                }, 400);
            } else {
                clearInterval(interval);
            }
        }, 1200);
    };
    
    setTimeout(() => {
        if(mainContent) mainContent.style.opacity = 1;
    }, 6500);

    const languages = { 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese', 'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi' };
    
    const populateLanguages = () => {
        if (!languageDropdown) return;
        for (const [code, name] of Object.entries(languages)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            languageDropdown.appendChild(option);
        }
        languageDropdown.value = targetLang;
    };

    const createLeaves = () => {
        if (!leavesContainer) return;
        for (let i = 0; i < 15; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 8 + 7}s`;
            leaf.style.animationDelay = `${Math.random() * 5}s`;
            leavesContainer.appendChild(leaf);
        }
    };

    const fetchTranslation = async () => {
        const text = inputText.value.trim();
        if (!text) {
            outputText.value = "";
            return;
        }

        translateButton.textContent = 'Translating...';
        translateButton.disabled = true;
        outputText.value = '...';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            if (data.responseData) {
                outputText.value = data.responseData.translatedText;
                detectedLang = data.responseData.detectedLanguage.toLowerCase();
                if (sourceLang === 'auto' && detectedLang && languages[detectedLang]) {
                    sourceLangHeader.textContent = `Detected: ${languages[detectedLang]}`;
                }
            } else {
                outputText.value = "Translation failed.";
            }
        } catch (error) {
            outputText.value = "Service connection error.";
        } finally {
            translateButton.textContent = 'Translate';
            translateButton.disabled = false;
        }
    };

    if (translateButton) translateButton.addEventListener('click', fetchTranslation);

    if (languageDropdown) {
        languageDropdown.addEventListener('change', (e) => {
            targetLang = e.target.value;
        });
    }

    if (switchLanguagesButton) {
        switchLanguagesButton.addEventListener('click', () => {
            const tempText = inputText.value;
            inputText.value = outputText.value;
            outputText.value = tempText;

            if (detectedLang && languages[detectedLang]) {
                const newTargetLang = detectedLang;
                const newSourceLang = targetLang;
                
                sourceLang = newSourceLang;
                targetLang = newTargetLang;
                detectedLang = '';

                languageDropdown.value = targetLang;
                sourceLangHeader.textContent = languages[sourceLang];
            }
        });
    }

    if(inputText) {
        inputText.addEventListener('input', () => {
            if (sourceLang !== 'auto') {
                sourceLang = 'auto';
                sourceLangHeader.textContent = 'Detect Language';
            }
        });
    }

    runStartupAnimation();
    populateLanguages();
    createLeaves();
});
