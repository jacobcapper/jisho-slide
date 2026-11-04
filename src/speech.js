// Text-to-speech helpers built on the browser's Web Speech API.

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

let jaVoice = null;

function pickVoice() {
    if (!ttsSupported) return;
    const voices = window.speechSynthesis.getVoices();
    const ja = voices.filter(v => v.lang?.toLowerCase().replace('_', '-').startsWith('ja'));
    // Prefer higher-quality voices when available (e.g. Google / Microsoft online voices).
    jaVoice = ja.find(v => /google|natural|online/i.test(v.name)) || ja[0] || null;
}

if (ttsSupported) {
    pickVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export function speak(text) {
    if (!ttsSupported || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    if (jaVoice) utterance.voice = jaVoice;
    utterance.rate = 0.9;
    synth.speak(utterance);
}

export function stopSpeaking() {
    if (ttsSupported) window.speechSynthesis.cancel();
}
