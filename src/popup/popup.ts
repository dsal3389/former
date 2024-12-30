import { BIBLE_QUOTES, type BibleQuote } from '@/_lib/consts';
import { Message, MessageType } from '@/_lib/messages';
import $ from 'jquery';

function messageHTML(message: Message): JQuery<HTMLDivElement> {
    let container = $("<div></div>") as JQuery<HTMLDivElement>;
    container.addClass(["text-[12px]", "flex", "items-center", "p-1", "space-x-1"]);

    let blockDiv = $("<div></div>") as JQuery<HTMLDivElement>;
    blockDiv.addClass(["p-1", "bg-red-100", "border", "rounded-full"]);
    blockDiv.append($("<object type=\"image/svg+xml\" data=\"/block.svg\" class=\"w-[12px]\"></object>"));

    let variantDiv = $("<div></div>") as JQuery<HTMLDivElement>;
    variantDiv.addClass(["p-1", "bg-blue-100", "border", "rounded"]);
    
    if (message.type === MessageType.Tab) {
        variantDiv.append($("<object type=\"image/svg+xml\" data=\"/tab.svg\" class=\"w-[12px]\"></object>"));
    }

    let urlDiv = $("<div></div>") as JQuery<HTMLDivElement>;
    urlDiv.append($(`<p class="line-through">${message.url}</p>`))

    container.append(blockDiv, variantDiv, urlDiv);
    return container;
}

function randomBibleQuote(): BibleQuote {
    let index = Math.floor(Math.random() * BIBLE_QUOTES.length);
    return BIBLE_QUOTES[index];
}

let quote = randomBibleQuote();
$("#verse").text(`"${quote.text}"`);
$("#verse-ref").text(`${quote.book} ${quote.chapter}:${quote.verse}`);

let port = chrome.runtime.connect();
port.onMessage.addListener((messages: Message[]) => {
    if (messages.length === 0) {
        return;
    }

    let div = $("#former-log-block");
    div.empty();

    for(let message of messages) {
        div.append(messageHTML(message))
    }
});

chrome.extension.isAllowedIncognitoAccess((enabled) => {
    if (!enabled) {
        $("#incognito-enable-message").fadeIn(800);
    }
});
