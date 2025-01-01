import { BIBLE_QUOTES, type BibleQuote } from '@/_lib/consts';
import { Message, Variant } from '@/_lib/messages';
import Client from '@/_lib/communication/client';
import $ from 'jquery';

let client = new Client();

// takes a message object, and returns the html
// representation of the message made with jquery
function messageHTML(message: Message): JQuery<HTMLDivElement> {
    let container = $("<div></div>") as JQuery<HTMLDivElement>;
    container.addClass(["text-[12px]", "flex", "items-center", "p-1", "space-x-1"]);

    let blockDiv = $("<div></div>") as JQuery<HTMLDivElement>;
    blockDiv.addClass(["p-1", "bg-red-100", "border", "rounded-full"]);
    blockDiv.append($("<object type=\"image/svg+xml\" data=\"/block.svg\" class=\"w-[12px]\"></object>"));

    let variantDiv = $("<div></div>") as JQuery<HTMLDivElement>;
    variantDiv.addClass(["p-1", "bg-blue-100", "border", "rounded"]);
    
    if (message.variant === Variant.Tab) {
        variantDiv.append($("<object type=\"image/svg+xml\" data=\"/tab.svg\" class=\"w-[12px]\"></object>"));
    }

    let urlDiv = $("<div></div>") as JQuery<HTMLDivElement>;
    urlDiv.append($(`<p class="line-through">${message.url}</p>`))

    container.append(blockDiv, variantDiv, urlDiv);
    return container;
}

function setMessagesHTML(messages: Message[]) {
    if (messages.length === 0) {
        return;
    }
    let div = $("#former-log-block");
    div.empty();
    div.append(messages.map((m) => messageHTML(m)));
}

function randomBibleQuote(): BibleQuote {
    let index = Math.floor(Math.random() * BIBLE_QUOTES.length);
    return BIBLE_QUOTES[index];
}

let quote = randomBibleQuote();
$("#verse").text(`"${quote.text}"`);
$("#verse-ref").text(`${quote.book} ${quote.chapter}:${quote.verse}`);

client.messages().then(setMessagesHTML);

chrome.extension.isAllowedIncognitoAccess((enabled) => {
    if (!enabled) {
        $("#incognito-enable-message").fadeIn(800);
    }
});
