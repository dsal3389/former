import { MessageQueue, Message, MessageType, Action } from "@/_lib/messages";
import { TOP_LEVEL_DOMAINS } from "@/_lib/consts";

class Background {
  private queue: MessageQueue

  constructor() {
    this.queue = new MessageQueue(100);
    chrome.runtime.onConnect.addListener((port) => {
      port.postMessage(this.queue.messages);
    });
  }

  beforeRequestHandler = (details: chrome.webRequest.WebRequestDetails): chrome.webRequest.BlockingResponse => {
    this.queue.addMessage(new Message(Action.Deny, MessageType.Traffic, details.url));
    return { cancel: true };
  }

  beforeTabNavigateHandler = (details: chrome.webNavigation.WebNavigationUrlCallbackDetails): void => {
    chrome.tabs.remove(details.tabId, () => {
      this.queue.addMessage(new Message(Action.Deny, MessageType.Tab, details.url));
    });
  }
}

let background = new Background();
chrome.webRequest.onBeforeRequest.addListener(background.beforeRequestHandler, { urls: TOP_LEVEL_DOMAINS.map((domain) => `*://${domain}.*`) }, ["blocking"]);
chrome.webNavigation.onBeforeNavigate.addListener(background.beforeTabNavigateHandler, { url: TOP_LEVEL_DOMAINS.map((domain) => { return { hostContains: `${domain}.` } }) });
