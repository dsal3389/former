import { Message, MessageType, Action } from "@/lib/messages";

const TOP_LEVEL_DOMAINS = [
  "xnxx",
  "pornhub"
]

let port = chrome.runtime.connect({ name: "former" })

function beforeRequestListener(_: chrome.webRequest.WebRequestDetails): chrome.webRequest.BlockingResponse {
  return { cancel: true };
}

function beforeTabNavigate(details: chrome.webNavigation.WebNavigationUrlCallbackDetails): void {
  chrome.tabs.remove(details.tabId, () => {
    port.postMessage(new Message(Action.Deny, MessageType.Tab, details.url));
  });
}

chrome.webRequest.onBeforeRequest.addListener(beforeRequestListener, { urls: TOP_LEVEL_DOMAINS.map((domain) => `*://${domain}.*`) }, ["blocking"]);
chrome.webNavigation.onBeforeNavigate.addListener(beforeTabNavigate, { url: TOP_LEVEL_DOMAINS.map((domain) => { return { hostContains: `${domain}.` } }) });
