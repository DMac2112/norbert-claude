export type Lang = 'en' | 'hu' | 'pl';

/**
 * Active language for the page being rendered, derived from the URL.
 * `/` (and anything without an /hu/ or /pl/ segment) → 'en'.
 * Works whether or not Astro.url.pathname includes the `base`.
 */
export function localeFromUrl(url: URL): Lang {
  const m = url.pathname.match(/\/(hu|pl)(\/|$)/);
  return m ? (m[1] as Lang) : 'en';
}
