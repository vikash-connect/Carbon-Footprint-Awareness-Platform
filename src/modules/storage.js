/**
 * Strips non-alphanumeric characters (keeps spaces, underscores, dashes, dots)
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
export function sanitize(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[^a-zA-Z0-9\s_.-]/g, '');
}

/**
 * Safely loads data from localStorage
 * @param {string} key - Storage key
 * @param {any} fallback - Fallback value if missing or corrupt
 * @returns {any} Parsed data or fallback
 */
function loadSafe(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        if (!data) return fallback;
        return JSON.parse(data);
    } catch (e) {
        console.warn(`Storage read error for key: ${key}`, e);
        return fallback;
    }
}

/**
 * Safely saves data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to stringify and store
 */
function saveSafe(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn(`Storage write error for key: ${key}`, e);
    }
}

/**
 * Loads user profile
 * @returns {Object|null} Profile object
 */
export function loadProfile() {
    return loadSafe('ecotrack_profile', null);
}

/**
 * Saves user profile
 * @param {Object} data - Profile data
 */
export function saveProfile(data) {
    saveSafe('ecotrack_profile', data);
}

/**
 * Loads activity logs
 * @returns {Array} Array of log objects
 */
export function loadLogs() {
    return loadSafe('ecotrack_logs', []);
}

/**
 * Saves activity logs
 * @param {Array} logs - Array of logs
 */
export function saveLogs(logs) {
    saveSafe('ecotrack_logs', logs);
}

/**
 * Clears all application data
 */
export function clearAll() {
    try {
        localStorage.removeItem('ecotrack_profile');
        localStorage.removeItem('ecotrack_logs');
    } catch (e) {
        console.warn('Storage clear error', e);
    }
}
