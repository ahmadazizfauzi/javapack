/**
 * URL Helper using environment-configured base URLs (never hardcoded).
 */
class UrlHelper {
  static getAppBaseUrl() {
    return (process.env.APP_BASE_URL || '').replace(/\/+$/, '');
  }

  static getClientUrl() {
    return (process.env.CLIENT_URL || '').replace(/\/+$/, '');
  }

  static resolveAssetUrl(pathOrUrl) {
    if (!pathOrUrl) {
      return null;
    }
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }
    const baseUrl = this.getAppBaseUrl();
    const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
  }
}

module.exports = UrlHelper;
