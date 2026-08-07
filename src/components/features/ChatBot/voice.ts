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
// mis-hearings are caught by phonetic similarity instead of an ever-growing exact-string list.
// Extend by adding the CORRECT spelling here — variants like "valery"/"gallery" for "Valory"
// are found automatically, no need to enumerate every way it gets misheard.
const KNOWN_TERMS = ['Jenslee', 'Valory', 'LTIMindtree'];

// Below these lengths a word's phonetic key is too short to distinguish from ordinary speech
// ("many" and "in" both reduce to 1-2 character keys) — skip matching entirely rather than
// risk misfiring on common words.
const MIN_WORD_LENGTH = 4;
const MIN_KEY_LENGTH = 3;

// Consonants that ASR commonly swaps for each other get folded to the same symbol.
const CONSONANT_GROUPS: [RegExp, string][] = [
    [/[bp]/g, 'b'],
    [/[ckq]/g, 'k'],
    [/[dt]/g, 't'],
    [/[fv]/g, 'f'],
    [/[gj]/g, 'g'],
    [/[sz]/g, 's'],
    [/[mn]/g, 'n'],
];

// Reduces a word to a rough phonetic shape: keep the first letter, drop vowels from the rest,
// merge similar-sounding consonants, and collapse doubled letters.
function phoneticKey(word: string): string {
    const lower = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!lower) return '';
    let key = lower[0] + lower.slice(1).replace(/[aeiouy]/g, '');
    for (const [pattern, replacement] of CONSONANT_GROUPS) {
        key = key.replace(pattern, replacement);
    }
    return key.replace(/(.)\1+/g, '$1');
}

function levenshteinDistance(a: string, b: string): number {
    const dist: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dist[i][0] = i;
    for (let j = 0; j <= b.length; j++) dist[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dist[i][j] = Math.min(dist[i - 1][j] + 1, dist[i][j - 1] + 1, dist[i - 1][j - 1] + cost);
        }
    }
    return dist[a.length][b.length];
}

function isCloseMatch(key: string, targetKey: string): boolean {
    const threshold = Math.max(1, Math.floor(Math.max(key.length, targetKey.length) * 0.45));
    return levenshteinDistance(key, targetKey) <= threshold;
}

const KNOWN_TERM_KEYS = KNOWN_TERMS
    .map(term => ({ term, key: phoneticKey(term) }))
    .filter(({ key }) => key.length >= MIN_KEY_LENGTH);

// True if `word` is already a known term (or an inflection like "Jenslee's") — used to leave
// correctly-recognized words alone rather than "correcting" them, and to stop a neighboring
// word from being merged into them by the bigram check below.
function isAlreadyKnownTerm(word: string): boolean {
    const lower = word.toLowerCase();
    return KNOWN_TERMS.some(term => lower.startsWith(term.toLowerCase()));
}

function findMatchingTerm(word: string): string | null {
    if (word.length < MIN_WORD_LENGTH || isAlreadyKnownTerm(word)) return null;
    const key = phoneticKey(word);
    if (key.length < MIN_KEY_LENGTH) return null;

    for (const { term, key: targetKey } of KNOWN_TERM_KEYS) {
        if (isCloseMatch(key, targetKey)) return term;
    }
    return null;
}

// Checks single words and adjacent word-pairs (to catch multi-word terms like "LTIMindtree"
// being split into "ltr matrix" by recognition) against the known vocabulary.
export function correctSpeechTranscript(transcript: string): string {
    const words = transcript.split(/\s+/).filter(Boolean);
    const result: string[] = [];
    let i = 0;

    while (i < words.length) {
        const canPair = i + 1 < words.length &&
            !isAlreadyKnownTerm(words[i]) &&
            !isAlreadyKnownTerm(words[i + 1]);

        if (canPair) {
            const bigramMatch = findMatchingTerm(words[i] + words[i + 1]);
            if (bigramMatch) {
                result.push(bigramMatch);
                i += 2;
                continue;
            }
        }
        result.push(findMatchingTerm(words[i]) ?? words[i]);
        i += 1;
    }

    return result.join(' ');
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
