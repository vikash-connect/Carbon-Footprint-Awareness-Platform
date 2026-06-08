import { jest } from '@jest/globals';
import { sanitize, saveProfile, loadProfile, clearAll } from '../src/modules/storage.js';

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
});

describe('Storage Module', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('sanitize', () => {
        it('strips non-alphanumeric characters', () => {
            expect(sanitize('Hello <script>alert(1)</script>')).toBe('Hello scriptalert1script');
            expect(sanitize('valid_input-123.45')).toBe('valid_input-123.45');
        });

        it('returns empty string for non-string inputs', () => {
            expect(sanitize(null)).toBe('');
            expect(sanitize(123)).toBe('');
            expect(sanitize({})).toBe('');
        });
    });

    describe('saveProfile and loadProfile', () => {
        it('completes a successful save/load round-trip', () => {
            const profile = { total: 1000, completed: true };
            saveProfile(profile);
            const loaded = loadProfile();
            expect(loaded).toEqual(profile);
        });

        it('returns null fallback for missing key', () => {
            const loaded = loadProfile();
            expect(loaded).toBeNull();
        });

        it('handles corrupted JSON gracefully', () => {
            // Inject corrupted JSON
            localStorage.setItem('ecotrack_profile', '{corrupt_json: true');
            
            // Mock console.warn to keep test output clean
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            
            const loaded = loadProfile();
            expect(loaded).toBeNull();
            expect(warnSpy).toHaveBeenCalled();
            warnSpy.mockRestore();
        });
    });

    describe('clearAll', () => {
        it('clears all application data', () => {
            saveProfile({ total: 1000 });
            clearAll();
            expect(loadProfile()).toBeNull();
        });
    });
});
