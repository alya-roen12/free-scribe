// FREE Translation API utilities
// No API key required for basic usage!

/**
 * Option 1: MyMemory Translation API (FREE - 10,000 chars/day)
 * No API key required for basic usage
 */
export async function translateWithMyMemory(text, targetLanguageCode) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguageCode}`
    );

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 || data.responseData) {
      return data.responseData.translatedText;
    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (error) {
    console.error('MyMemory Translation Error:', error);
    throw error;
  }
}

/**
 * Option 2: LibreTranslate API (FREE - Self-hosted or public instance)
 * Public instance: https://libretranslate.com
 * Optional: Can self-host for unlimited free usage
 */
export async function translateWithLibreTranslate(text, targetLanguageCode) {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLanguageCode,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('LibreTranslate Error:', error);
    throw error;
  }
}

/**
 * Option 3: Google Translate (Unofficial/Free API)
 * Uses a free, unofficial endpoint
 * Note: This is unofficial and may be rate-limited
 */
export async function translateWithGoogleFree(text, targetLanguageCode) {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguageCode}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    
    // Google's response is complex nested array
    let translatedText = '';
    data[0].forEach(item => {
      if (item[0]) {
        translatedText += item[0];
      }
    });
    
    return translatedText;
  } catch (error) {
    console.error('Google Translate Error:', error);
    throw error;
  }
}

/**
 * Main translation function - tries multiple services for reliability
 */
export async function translateText(text, targetLanguage) {
  const languageCode = FREE_LANGUAGE_CODES[targetLanguage];
  
  if (!languageCode) {
    throw new Error('Unsupported language');
  }

  // Try services in order of preference
  const services = [
    { name: 'MyMemory', fn: translateWithMyMemory },
    { name: 'LibreTranslate', fn: translateWithLibreTranslate },
    { name: 'Google', fn: translateWithGoogleFree }
  ];

  for (const service of services) {
    try {
      console.log(`Trying ${service.name}...`);
      const result = await service.fn(text, languageCode);
      console.log(`✓ ${service.name} succeeded`);
      return result;
    } catch (error) {
      console.log(`✗ ${service.name} failed:`, error.message);
      // Continue to next service
    }
  }

  throw new Error('All translation services failed. Please try again later.');
}

/**
 * Language codes for FREE translation services
 * These codes work across MyMemory, LibreTranslate, and Google Translate
 */
export const FREE_LANGUAGE_CODES = {
  "Spanish": "es",
  "French": "fr",
  "German": "de",
  "Italian": "it",
  "Portuguese": "pt",
  "Dutch": "nl",
  "Russian": "ru",
  "Chinese (Simplified)": "zh-CN",
  "Chinese (Traditional)": "zh-TW",
  "Japanese": "ja",
  "Korean": "ko",
  "Arabic": "ar",
  "Hindi": "hi",
  "Turkish": "tr",
  "Polish": "pl",
  "Ukrainian": "uk",
  "Romanian": "ro",
  "Greek": "el",
  "Czech": "cs",
  "Swedish": "sv",
  "Danish": "da",
  "Finnish": "fi",
  "Norwegian": "no",
  "Hebrew": "he",
  "Thai": "th",
  "Vietnamese": "vi",
  "Indonesian": "id",
  "Malay": "ms",
  "Filipino": "tl",
  "Bengali": "bn",
  "Tamil": "ta",
  "Telugu": "te",
  "Urdu": "ur",
  "Persian": "fa",
  "Swahili": "sw",
  "Hungarian": "hu",
  "Bulgarian": "bg",
  "Slovak": "sk",
  "Croatian": "hr",
  "Lithuanian": "lt",
  "Slovenian": "sl",
  "Latvian": "lv",
  "Estonian": "et",
  "Catalan": "ca",
};

/**
 * Get supported languages for the UI
 */
export const FREE_SUPPORTED_LANGUAGES = Object.keys(FREE_LANGUAGE_CODES);