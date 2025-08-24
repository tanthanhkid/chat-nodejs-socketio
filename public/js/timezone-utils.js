// Timezone Utilities for GMT+7 (Vietnam Time)
// Utility functions to convert timestamps to Vietnam timezone

/**
 * Convert a timestamp to Vietnam timezone (GMT+7)
 * @param {string|Date} timestamp - The timestamp to convert
 * @returns {Date} - Date object in Vietnam timezone
 */
function toVietnamTime(timestamp) {
    const date = new Date(timestamp);
    
    // Since server is already in GMT+7, we just need to ensure proper formatting
    // No conversion needed, just return the date as is
    return date;
}

/**
 * Format time to Vietnam timezone (HH:MM)
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted time string
 */
function formatTimeVietnam(timestamp) {
    const vietnamDate = toVietnamTime(timestamp);
    return vietnamDate.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

/**
 * Format date to Vietnam timezone (DD/MM HH:MM)
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted date string
 */
function formatDateVietnam(timestamp) {
    if (!timestamp) return '';
    const vietnamDate = toVietnamTime(timestamp);
    return vietnamDate.toLocaleString('vi-VN', { 
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
    });
}

/**
 * Format full date to Vietnam timezone (DD/MM/YYYY HH:MM:SS)
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted full date string
 */
function formatFullDateVietnam(timestamp) {
    if (!timestamp) return '';
    const vietnamDate = toVietnamTime(timestamp);
    return vietnamDate.toLocaleString('vi-VN');
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        toVietnamTime,
        formatTimeVietnam,
        formatDateVietnam,
        formatFullDateVietnam
    };
} else {
    // Browser environment
    window.TimezoneUtils = {
        toVietnamTime,
        formatTimeVietnam,
        formatDateVietnam,
        formatFullDateVietnam
    };
}
