import { test, expect, describe } from 'vitest';
import { correctSpeechTranscript, extractSpeakableChunks, stripMarkdownForSpeech } from './voice';

describe('correctSpeechTranscript', () => {
    test('corrects phonetic mis-hearings of Jenslee', () => {
        expect(correctSpeechTranscript('densely')).toBe('Jenslee');
    });

    test('corrects phonetic mis-hearings of Valory', () => {
        expect(correctSpeechTranscript('valery')).toBe('Valory');
        expect(correctSpeechTranscript('gallery')).toBe('Valory');
    });

    test('corrects multi-word mis-hearings of LTIMindtree', () => {
        expect(correctSpeechTranscript('ltr matrix')).toBe('LTIMindtree');
        expect(correctSpeechTranscript('ltr mindtree')).toBe('LTIMindtree');
    });

    test('leaves already-correct terms and their inflections alone', () => {
        const sentence = "what is Jenslee's experience with Valory";
        expect(correctSpeechTranscript(sentence)).toBe(sentence);
    });

    test('does not misfire on ordinary short words', () => {
        expect(correctSpeechTranscript('how many years of experience')).toBe('how many years of experience');
        expect(correctSpeechTranscript('is he in the office')).toBe('is he in the office');
    });
});

describe('extractSpeakableChunks', () => {
    test('extracts only complete sentences while streaming', () => {
        const { chunks, consumedLength } = extractSpeakableChunks('Hello there. How can', false);
        expect(chunks).toEqual(['Hello there.']);
        expect(consumedLength).toBe('Hello there.'.length + 1);
    });

    test('flushes a trailing sentence fragment once final', () => {
        const { chunks, consumedLength } = extractSpeakableChunks('Hello there. How can', true);
        expect(chunks).toEqual(['Hello there.', 'How can']);
        expect(consumedLength).toBe('Hello there. How can'.length);
    });
});

describe('stripMarkdownForSpeech', () => {
    test('removes markdown syntax so it is not read aloud literally', () => {
        expect(stripMarkdownForSpeech('**bold** and `code` and [a link](https://x.com)')).toBe('bold and code and a link');
    });
});
