export default class MiniRouter {
  #listeners: Listener[] = [];
  #prevUrl: URL;
  #currentUrl: URL;

  constructor() {
    this.#currentUrl = this.#getCurrentUrl();
    this.#prevUrl = this.#currentUrl;
    // TODO: release subscription when router destroyed (method not provided yet)
    window.addEventListener("popstate", () => {
      this.#triggerUrlChange(this.#getCurrentUrl());
    });
  }

  /**
   * Gets current url.
   */
  get current(): URL {
    return new URL(this.#currentUrl);
  }

  /**
   * Gets previous url.
   */
  get prev(): URL {
    return new URL(this.#prevUrl);
  }

  /**
   * Registeres url change listener.
   * @param condition - function which determines whether to handle specific url change.
   * @param handler - function that will be called when condition is met.
   */
  public on(condition: Matcher, handler: Handler) {
    this.#listeners.push({
      condition,
      handler,
    });
  }

  /**
   * Applies url change by adding new history state.
   * @param uriOrUrl - Uri (/path/path/?q=1#test) or URL object that will be applied to url with history.push.
   */
  public push(uriOrUrl: string | URL) {
    const newPath = this.#getNewPath(uriOrUrl);
    window.history.pushState({}, "", newPath);
    this.#triggerUrlChange(this.#getCurrentUrl());
  }

  /**
   * Applies url change by adding new history state.
   * @param uriOrUrl - Uri (/path/path/?q=1#test) or URL object that will be applied to url with history.push.
   */
  public replace(uriOrUrl: string | URL) {
    const newPath = this.#getNewPath(uriOrUrl);
    window.history.replaceState({}, "", newPath);
    this.#triggerUrlChange(this.#getCurrentUrl());
  }

  /**
   * Constructs new URL object form current page url.
   */
  #getCurrentUrl() {
    return new URL(window.location.href);
  }

  /**
   * Constructs new URI (as string) based on original URI or URL.
   */
  #getNewPath(uriOrUrl: string | URL) {
    let url: URL;
    if (typeof uriOrUrl === "string") {
      url = new URL(
        `${this.#currentUrl.protocol}//${this.#currentUrl.host}/${uriOrUrl}`
      );
    } else {
      url = uriOrUrl;
    }

    const newPath = `${url.pathname}${url.search}${url.hash}`;
    return newPath;
  }

  /**
   * triggers url change that will be handled with listeners added with .on() method.
   * @param url - the URL that will be processed with registered handlers.
   */
  #triggerUrlChange(url: URL) {
    this.#prevUrl = this.#currentUrl;
    this.#currentUrl = url;

    const p = this.#prevUrl;
    const c = this.#currentUrl;
    const changeInfo: UrlChangeInfo = {
      isPathChanged: p.pathname !== c.pathname,
      isSearchChanged: p.search !== c.search,
      isHashChanged: p.hash !== p.hash,
    };

    this.#listeners.forEach((l) => {
      if (l.condition === true || l.condition(this.#currentUrl, changeInfo)) {
        l.handler(this.#currentUrl);
      }
    });
  }
}

export type Matcher = (url: URL, changeInfo: UrlChangeInfo) => boolean;
export type Handler = (url: URL) => void;
export type Listener = {
  condition: Matcher | true;
  handler: Handler;
};

export interface UrlChangeInfo {
  isPathChanged: boolean;
  isSearchChanged: boolean;
  isHashChanged: boolean;
}
