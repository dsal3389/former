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

// MessageLisener create a Deque<Message> and 
// automatically listen for events from `chrome.runtime.onMessage`,
// when message is recived, dispatch a new event
export class MessageQueue {
    private deque: Deque<Message>;

    constructor(size: number) {
        this.deque = new Deque(size);
    }

    get messages(): Message[] {
        return [...this.deque]
    }

    addMessage(message: Message): boolean {
        return this.deque.unshift(message);
    }
}
