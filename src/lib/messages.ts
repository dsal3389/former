import Deque from "./deque";

export enum Action {
    Permit,
    Deny,
}

export enum MessageType {
    Tab,
    Traffic,
}

// represent `former` plugin event message
// used everywhere
export class Message {
    action: Action;
    type: MessageType;
    url: string;

    constructor(action: Action, type: MessageType, url: string) {
        this.action = action;
        this.type = type;
        this.url = url;
    }
}

export class MessageListenerEvent {
    limit_reached: boolean;
    message: Message;

    constructor(limit_reached: boolean, message: Message) {
        this.limit_reached = limit_reached;
        this.message = message;
    }
}


type OnMessageCallbackType = (event: MessageListenerEvent) => void;

// MessageLisener create a Deque<Message> and 
// automatically listen for events from `chrome.runtime.onMessage`,
// when message is recived, dispatch a new event
export class MessageListener {
    private deque: Deque<Message>;
    private onMessageCallback: OnMessageCallbackType | null

    constructor() {
        this.deque = new Deque(50);
        this.onMessageCallback = null;
        chrome.runtime.onMessage.addListener(this.onMessageEvent);
    }

    private onMessageEvent(message: Message) {
        console.log("got event")
        const poped = this.deque.unshift(message);
        if(this.onMessageCallback !== null) {
            this.onMessageCallback(new MessageListenerEvent(poped, message));
        }
    }

    onMessage(callback: OnMessageCallbackType) {
        this.onMessageCallback = callback;
    }
}
