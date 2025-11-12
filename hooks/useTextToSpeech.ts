
import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    
    // Voices might load asynchronously
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // Initial load

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn("Speech Synthesis not supported.");
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a male Russian voice
    const maleRussianVoice = voices.find(voice => 
        voice.lang.startsWith('ru') && 
        (voice.name.toLowerCase().includes('мужской') || 
         voice.name.toLowerCase().includes('male') ||
         voice.name.toLowerCase().includes('alexander') || // Common voice name
         voice.name.toLowerCase().includes('yuri'))
    );

    if (maleRussianVoice) {
        utterance.voice = maleRussianVoice;
    } else {
        // Fallback to any Russian voice
        const russianVoice = voices.find(voice => voice.lang.startsWith('ru'));
        if (russianVoice) {
            utterance.voice = russianVoice;
        }
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, cancel };
};
