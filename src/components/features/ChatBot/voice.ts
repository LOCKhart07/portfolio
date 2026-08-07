// Chrome/Edge use the unprefixed name, Safari and older Chromium builds the webkit-prefixed one.
// Firefox ships neither (recognition is flagged off, backed by Pocketsphinx) — callers should
// hide mic UI entirely when this returns null rather than rendering a button that can't work.
export function getSpeechRecognitionConstructor(): (new () => SpeechRecognition) | null {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// SpeechRecognition has no reliable way to bias its vocabulary toward domain-specific proper
// nouns (SpeechGrammarList exists but Chrome largely ignores it for free-form dictation), so
// known mis-hearings are corrected here instead. Extend as new ones turn up.
const TRANSCRIPT_CORRECTIONS: [pattern: RegExp, replacement: string][] = [
    [/\bdensely\b/gi, 'Jenslee'],
    [/\bltr matrix\b/gi, 'LTIMindtree'],
    [/\bltr mindtree\b/gi, 'LTIMindtree'],
    [/\bjewellery\b/gi, 'Valory'],
    [/\bvalery\b/gi, 'Valory'],
    [/\bgallery\b/gi, 'Valory'],
];

export function correctSpeechTranscript(transcript: string): string {
    return TRANSCRIPT_CORRECTIONS.reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        transcript
    );
}

const SENTENCE_BOUNDARY = /[.!?](?:\s|$)|\n+/;

// Pulls complete sentences off the front of a streaming text buffer so they can be spoken
// as they arrive instead of waiting for the full response. `consumedLength` tells the caller
// how much of `buffer` was turned into chunks, so it can track what's left unspoken.
// When `isFinal` is true, any trailing text without sentence punctuation is flushed too.
export function extractSpeakableChunks(
    buffer: string,
    isFinal: boolean
): { chunks: string[]; consumedLength: number } {
    const chunks: string[] = [];
    let consumedLength = 0;

    while (true) {
        const match = buffer.slice(consumedLength).match(SENTENCE_BOUNDARY);
        if (!match || match.index === undefined) break;

        const boundaryEnd = consumedLength + match.index + match[0].length;
        const sentence = buffer.slice(consumedLength, boundaryEnd).trim();
        if (sentence) chunks.push(sentence);
        consumedLength = boundaryEnd;
    }

    if (isFinal) {
        const remainder = buffer.slice(consumedLength).trim();
        if (remainder) {
            chunks.push(remainder);
            consumedLength = buffer.length;
        }
    }

    return { chunks, consumedLength };
}

// speechSynthesis reads markdown syntax literally ("asterisk asterisk bold asterisk asterisk"),
// so strip it before handing text to an utterance.
export function stripMarkdownForSpeech(text: string): string {
    return text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
        .replace(/[*_~#>]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
