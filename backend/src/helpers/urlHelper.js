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
    const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    if (normalizedPath.startsWith('/images/')) {
      return normalizedPath;
    }
    const baseUrl = this.getAppBaseUrl();
    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
  }
}

module.exports = UrlHelper;
