// TypeScript's DOM lib ships the SpeechRecognitionEvent/Result types but not the
// SpeechRecognition interface itself or its constructors — the recognition side of
// the Web Speech API is still non-standard (Chromium-only, webkit-prefixed).
interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
}
