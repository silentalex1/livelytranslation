document.addEventListener('DOMContentLoaded', () => {
    const startupAnimation = document.getElementById('startup-animation');
    const mainContent = document.getElementById('main-content');
    const animatedText = document.getElementById('animated-text');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const translateButton = document.getElementById('translate-button');
    const switchLanguagesButton = document.getElementById('switch-languages');
    const languageDropdown = document.getElementById('language-dropdown');
    const sourceLangDisplay = document.getElementById('source-lang-display');
    const leavesContainer = document.querySelector('.leaves-container');

    let sourceLang = 'auto';
    let targetLang = 'es';

    const animationPhrases = [
        `Translate <span class="lively-text">lively.</span>`,
        `Traducir <span class="lively-text">fluidamente.</span>`,
        `Traduire <span class="lively-text">avec aisance.</span>`,
        `Übersetzen <span class="lively-text">lebendig.</span>`,
        `翻訳する <span class="lively-text">生き生きと.</span>`
    ];
    let phraseIndex = 0;

    function runStartupAnimation() {
        animatedText.style.opacity = 0;
        
        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % animationPhrases.length;
            animatedText.innerHTML = animationPhrases[phraseIndex];
            animatedText.style.opacity = 1;
        }, 500);
    }
    
    animatedText.style.opacity = 1;
    const animationInterval = setInterval(runStartupAnimation, 1500);

    setTimeout(() => {
        clearInterval(animationInterval);
    }, 6500);

    function createLeaves() {
        const leafCount = 20;
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 8}s`;
            leaf.style.animationDelay = `${Math.random() * 5}s`;
            if (leavesContainer) {
                leavesContainer.appendChild(leaf);
            }
        }
    }

    const languages = { 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese', 'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh-CN': 'Chinese', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi' };
    
    function populateLanguages() {
        for (const [code, name] of Object.entries(languages)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            languageDropdown.appendChild(option);
        }
        languageDropdown.value = targetLang;
    }

    async function fetchTranslation() {
        const text = inputText.value.trim();
        if (!text) {
            outputText.value = "";
            return;
        }

        translateButton.disabled = true;
        translateButton.textContent = 'Translating...';
        outputText.value = '...';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response failed');
            }
            const data = await response.json();
            
            if (data.responseData) {
                outputText.value = data.responseData.translatedText;
                if (sourceLang === 'auto' && data.responseData.detectedLanguage) {
                    const detectedCode = data.responseData.detectedLanguage.toLowerCase();
                    sourceLangDisplay.textContent = `Detected: ${languages[detectedCode] || 'Unknown'}`;
                }
            } else {
                outputText.value = "Translation failed. Please try again.";
            }
        } catch (error) {
            outputText.value = "Error: Could not connect to service.";
        } finally {
            translateButton.disabled = false;
            translateButton.textContent = 'Translate';
        }
    }
    
    translateButton.addEventListener('click', fetchTranslation);

    languageDropdown.addEventListener('change', (e) => {
        targetLang = e.target.value;
    });

    switchLanguagesButton.addEventListener('click', () => {
        const detectedLangMatch = sourceLangDisplay.textContent.match(/Detected: (.*)/);
        if (sourceLang === 'auto' && !detectedLangMatch) return;

        const tempText = inputText.value;
        inputText.value = outputText.value;
        outputText.value = tempText;
        
        const currentSourceLangName = detectedLangMatch ? detectedLangMatch[1] : languages[sourceLang];
        const currentTargetLangCode = Object.keys(languages).find(key => languages[key] === currentSourceLangName) || 'en';

        const newSourceLang = targetLang;
        const newTargetLang = currentTargetLangCode;

        sourceLang = newSourceLang;
        targetLang = newTargetLang;

        languageDropdown.value = targetLang;
        sourceLangDisplay.textContent = languages[sourceLang];
    });
    
    inputText.addEventListener('input', () => {
        sourceLang = 'auto';
        sourceLangDisplay.textContent = "Detect Language";
    });

    createLeaves();
    populateLanguages();
});
