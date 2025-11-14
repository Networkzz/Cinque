import { useRef, useEffect, useState } from "react";

interface UseTextToSpeechOptions {
  language: string;
}

// Language code mappings for better voice matching
const languageCodeMap: { [key: string]: string[] } = {
  "en-US": ["en", "en-US", "en-GB"],
  "es-ES": ["es", "es-ES", "es-MX"],
  "fr-FR": ["fr", "fr-FR", "fr-CA"],
  "de-DE": ["de", "de-DE", "de-AT"],
  "it-IT": ["it", "it-IT"],
  "pt-BR": ["pt", "pt-BR", "pt-PT"],
  "nl-NL": ["nl", "nl-NL", "nl-BE"],
};

// Get the best available voice for browser TTS
const getBrowserVoice = (
  languageCode: string,
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null => {
  if (voices.length === 0) return null;

  const searchCodes = languageCodeMap[languageCode] || [
    languageCode,
    languageCode.split("-")[0],
  ];

  // Try to find a match using the language code map
  for (const searchCode of searchCodes) {
    const lowerSearch = searchCode.toLowerCase();

    // Try exact match first
    let voice = voices.find((v) => v.lang.toLowerCase() === lowerSearch);

    // Try prefix match
    if (!voice) {
      voice = voices.find((v) => v.lang.toLowerCase().startsWith(lowerSearch));
    }

    if (voice) return voice;
  }

  // Fallback: try language prefix (e.g., "zh" from "zh-CN")
  const langPrefix = languageCode.split("-")[0].toLowerCase();
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

  // Last resort: return any available voice
  return voice || voices[0];
};

export const useTextToSpeech = ({ language }: UseTextToSpeechOptions) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load voices - some browsers load them asynchronously
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      }
    };

    // Load immediately
    loadVoices();

    // Some browsers load voices asynchronously
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = (text: string) => {
    // Cancel any ongoing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // Check if browser supports speech synthesis
    if (!("speechSynthesis" in window)) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    // Get current voices (they might have loaded after component mount)
    const currentVoices =
      voices.length > 0 ? voices : window.speechSynthesis.getVoices();

    if (currentVoices.length === 0) {
      console.warn(
        "No TTS voices available. You may need to install language packs."
      );
      // Still try to speak without specifying a voice
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;

    // Try to get the best voice for the language
    if (currentVoices.length > 0) {
      const voice = getBrowserVoice(language, currentVoices);
      if (voice) {
        utterance.voice = voice;
        console.log(
          `Using voice: ${voice.name} (${voice.lang}) for ${language}`
        );
      } else {
        console.warn(
          `No voice found for ${language}. Available voices:`,
          currentVoices.map((v) => `${v.name} (${v.lang})`)
        );
      }
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Store reference
    utteranceRef.current = utterance;

    // Speak
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
  };

  return { speak, stop };
};
