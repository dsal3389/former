import { BIBLE_QUOTES, type BibleQuote } from '@/_lib/consts';
import { Message } from '@/_lib/messages';
import Client from '@/_lib/communication/client';
import $ from 'jquery';

let client = new Client();

enum TrafficContainerKind {
    Empty,
    List,
    Details
}

interface TrafficContainerEmptyView {
    kind: TrafficContainerKind.Empty
}

interface TrafficContainerListView {
    kind: TrafficContainerKind.List,
    messages: Message[]
}

interface TrafficContainerDetailsView {
    kind: TrafficContainerKind.Details,
    message: Message,
}

type TrafficContainerView = TrafficContainerEmptyView | TrafficContainerListView | TrafficContainerDetailsView;

function viewMessageDetails(_message: Message) {
    let view = $("#traffic-details-view");

    // this should not happen, element is already displayed
    // but another attempt was made to display details
    if(view.css("display") !== "none") {
        return;
    }

    view
        .show()
        .animate({ top: 0 }, 300, function() {
            $("#traffic-details-head > button").on("click", () => {
                view.animate({ top: "100%" }, 130, function() { view.hide() });
            });
        });

}

function emptyTrafficContainer() {
    $("#former-traffic-container").children().each(function() {
        $(this).hide();
    });
    $("#traffic-empty-view").show();
}

function listTrafficContainer(messages: Message[]) {
    $("#traffic-empty-view").fadeOut(300);
    $("#traffic-list-view").show();
    let listCntr = $("#traffic-list");

    messages.forEach((message, i) => {
        $(document.createElement("div"))
            .addClass("traffic")
            .html(function() {
                let url = $(document.createElement("p"))
                    .text(message.url);
                // let reasonIcon;
                
                // switch(message.reason) {
                //     case Reason.Domain:
                //         reasonIcon = $(document.createElement("svg")).load("tab.svg");
                // }
                // return reasonIcon!.html() + url.html();
                return url.html();
            })
            .on("click", function() {
                listCntr.css("overflow-y", "hidden");
                viewMessageDetails(message);
            })
            .hide()
            .appendTo(listCntr)
            .fadeIn(500 + (i * 100));
        }
    )
}

function setTrafficContainerView(view: TrafficContainerView) {
    switch (view.kind) {
        case TrafficContainerKind.Empty:
            emptyTrafficContainer();
            break;
        case TrafficContainerKind.List:
            listTrafficContainer(view.messages);
            break;
    }
}

client.messages().then((messages) => {
    if (messages.length === 0) {
        setTrafficContainerView({ kind: TrafficContainerKind.Empty });
    } else {
        setTrafficContainerView({ kind: TrafficContainerKind.List, messages: messages });
    }
});





function randomBibleQuote(): BibleQuote {
    let index = Math.floor(Math.random() * BIBLE_QUOTES.length);
    return BIBLE_QUOTES[index];
}

let quote = randomBibleQuote();
$("#verse").text(`"${quote.text}"`);
$("#verse-ref").text(`${quote.book} ${quote.chapter}:${quote.verse}`);

chrome.extension.isAllowedIncognitoAccess((enabled) => {
    if (!enabled) {
        $("#incognito-enable-message").fadeIn(800);
    }
});
