/**
 * Date helper for Indonesian Western Time (WIB / UTC+7).
 */
class DateHelper {
  /**
   * Format date to Indonesian localized WIB string (e.g. "9 November 2026, 20:20 WIB")
   */
  static formatWib(date = new Date(), options = {}) {
    const defaultOptions = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      ...options
    };

    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat('id-ID', defaultOptions).format(d) + ' WIB';
  }

  /**
   * Get current timestamp in ISO format guaranteed in WIB
   */
  static nowWib() {
    return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' });
  }
}

module.exports = DateHelper;

