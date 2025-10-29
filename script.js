document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const startupAnimation = document.getElementById('startup-animation');
    const mainContent = document.getElementById('main-content');
    const animatedText = document.getElementById('animated-text');
    const livelyTextSpan = animatedText.querySelector('.lively-text');
    
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const translateButton = document.getElementById('translate-button');
    const switchLanguagesButton = document.getElementById('switch-languages');
    const languageDropdown = document.getElementById('language-dropdown');
    const sourceLangHeader = document.getElementById('source-lang-header');
    const leavesContainer = document.querySelector('.leaves-container');

    // --- State Management ---
    let sourceLang = 'auto'; // auto-detect by default
    let targetLang = 'es'; // Spanish by default

    // --- Startup Animation Logic ---
    const animationPhrases = [
        { text: 'Translate ', lively: 'lively.' },
        { text: 'Traducir ', lively: 'fluidamente.' }, // Spanish
        { text: 'Traduire ', lively: 'avec aisance.' }, // French
        { text: 'Übersetzen ', lively: 'lebendig.' }, // German
        { text: '翻訳する ', lively: '生き生きと.' }     // Japanese
    ];
    let phraseIndex = 0;

    const morphAnimation = () => {
        phraseIndex = (phraseIndex + 1) % animationPhrases.length;
        
        // Fade out
        animatedText.style.opacity = 0;
        animatedText.style.transform = 'translateY(20px) rotateX(-45deg)';

        setTimeout(() => {
            // Update text
            const phrase = animationPhrases[phraseIndex];
            animatedText.textContent = phrase.text;
            const newLivelySpan = document.createElement('span');
            newLivelySpan.className = 'lively-text';
            newLivelySpan.textContent = phrase.lively;
            animatedText.appendChild(newLivelySpan);

            // Fade in
            animatedText.style.opacity = 1;
            animatedText.style.transform = 'translateY(0) rotateX(0deg)';
        }, 600);
    };

    const animationInterval = setInterval(morphAnimation, 1500);

    // End startup animation and show main content
    setTimeout(() => {
        clearInterval(animationInterval);
        startupAnimation.style.opacity = 0;
        startupAnimation.style.pointerEvents = 'none';
        mainContent.style.opacity = 1;
        mainContent.style.transform = 'scale(1)';
    }, 7000);
    
    // --- Background Visuals ---
    function createLeaves() {
        const leafCount = 20;
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 8}s`; // 8-13 seconds
            leaf.style.animationDelay = `${Math.random() * 5}s`;
            leavesContainer.appendChild(leaf);
        }
    }

    // --- Language Population ---
    const languages = { 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese', 'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh-CN': 'Chinese (Simplified)', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi', 'nl': 'Dutch', 'sv': 'Swedish', 'fi': 'Finnish', 'da': 'Danish', 'pl': 'Polish', 'tr': 'Turkish' };
    
    function populateLanguages() {
        for (const [code, name] of Object.entries(languages)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            languageDropdown.appendChild(option);
        }
        languageDropdown.value = targetLang; // Set default
    }

    // --- Core Translation Function ---
    async function fetchTranslation() {
        const text = inputText.value.trim();
        if (!text) {
            outputText.value = "";
            return;
        }

        translateButton.textContent = 'Translating...';
        outputText.value = '...';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            
            if (data.responseData) {
                outputText.value = data.responseData.translatedText;
                // Auto-detect language result
                if (sourceLang === 'auto' && data.responseData.detectedLanguage) {
                     sourceLangHeader.textContent = `Detected: ${languages[data.responseData.detectedLanguage.toLowerCase()] || 'Unknown'}`;
                }
            } else {
                outputText.value = "Translation failed. Please try again.";
            }

        } catch (error) {
            console.error("Translation Error:", error);
            outputText.value = "Error connecting to the translation service.";
        } finally {
            translateButton.textContent = 'Translate';
        }
    }
    
    // --- Event Listeners ---
    translateButton.addEventListener('click', fetchTranslation);

    languageDropdown.addEventListener('change', (e) => {
        targetLang = e.target.value;
    });

    switchLanguagesButton.addEventListener('click', () => {
        // Can't switch if source is auto-detected and output is empty
        if (sourceLang === 'auto' && !outputText.value) return;

        // Swap text content
        const tempText = inputText.value;
        inputText.value = outputText.value;
        outputText.value = tempText;

        // Swap languages
        const tempLang = sourceLang === 'auto' ? 'en' : sourceLang; // Assume English if auto
        sourceLang = targetLang;
        targetLang = tempLang;

        // Update UI
        languageDropdown.value = targetLang;
        sourceLangHeader.textContent = languages[sourceLang];
    });
    
    inputText.addEventListener('input', () => {
        // When user types in the source box, reset detection
        if(sourceLang !== 'auto' && sourceLangHeader.textContent.startsWith("Detected:")){
             sourceLangHeader.textContent = languages[sourceLang] || "Detect Language";
        } else if (!sourceLangHeader.textContent.startsWith("Detect")) {
            // Keep the assigned language if not auto
        } else {
            sourceLang = 'auto';
            sourceLangHeader.textContent = "Detect Language";
        }
    });

    // --- Initializations ---
    createLeaves();
    populateLanguages();
});```
