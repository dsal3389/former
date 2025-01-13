import Deque from "@/_lib/deque";
import { Message, Variant, FilterRule } from "@/_lib/messages";
import type { RequestWithId, Response } from "@/_lib/communication/types";

const BLACKLISTED_DOMAINS = [
  "xnxx.com",
];

// const BLACKLISTED_KEYWORDS = [
//   "porn",
//   "xvideos",
// ];

class Background {
  private queue: Deque<Message>;

  constructor() {
    this.queue = new Deque(100);
    chrome.runtime.onConnect.addListener(this.handleConnectedPort);
  }

  handleConnectedPort = (port: chrome.runtime.Port) => {
    port.onMessage.addListener((message: RequestWithId<any>) => {
      if(message.action === 'messages') {
        port.postMessage({ 
          for_id: message.id, 
          payload: [...this.queue]
        } as Response<Message[]>);
      }
    });
  }

  // function to handle (pre) web request, by default if this function is called
  // it means we git a Top Level Domain, so the default behavior is to just cancel the request
  beforeRequestHandler = (details: chrome.webRequest.WebRequestDetails): chrome.webRequest.BlockingResponse => {
    this.queue.unshift(new Message(Variant.Traffic, details.url, FilterRule.Domain, null));
    return { cancel: true };
  }

  // function to handle tab navigation, if this function is called, by default
  // it will close the current tab, because it will only be called when we hit Top Level Domain
  beforeTabNavigateHandler = (details: chrome.webNavigation.WebNavigationUrlCallbackDetails): void => {
    chrome.tabs.remove(details.tabId, () => {
      this.queue.unshift(new Message(Variant.Tab, details.url, FilterRule.Domain, null));
    });
  }

  onDOMContentLoadedHandler = (details: chrome.webNavigation.WebNavigationCallbackDetails) => {
    chrome.scripting.executeScript({
      target: {tabId: details.tabId},
      files: ["background/scripts/verify_meta_keywords.js"]
    })
  }
}

let background = new Background();
chrome.webRequest.onBeforeRequest.addListener(background.beforeRequestHandler, { urls: BLACKLISTED_DOMAINS.map((domain) => `*://${domain}`) }, ["blocking"]);
chrome.webNavigation.onBeforeNavigate.addListener(background.beforeTabNavigateHandler, { url: BLACKLISTED_DOMAINS.map((domain) => { return { hostEquals: domain } }) });
chrome.webNavigation.onDOMContentLoaded.addListener(background.onDOMContentLoadedHandler)
