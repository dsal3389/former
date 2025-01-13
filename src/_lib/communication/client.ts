import type { Request, RequestWithId, Response } from "./types";
import type { Message } from "../messages";

export default class Client {
    private id_counter: number;
    private port: chrome.runtime.Port;
    private awaitingResponse: Map<number, (_: any) => void>

    constructor() {
        this.id_counter = 0;
        this.awaitingResponse = new Map();

        this.port = chrome.runtime.connect();
        this.port.onMessage.addListener((message: Response<any>) => {
            let resolve = this.awaitingResponse.get(message.for_id);
            if(resolve !== undefined) {
                this.awaitingResponse.delete(message.for_id);
                resolve(message.payload);
            }
        })
    }

    request = <T, P>(req: Request<T>): Promise<P> => {
        let request: RequestWithId<T> = {
            id: this.id_counter++,
            ...req
        };
        return new Promise((resolve) => {
            this.port.postMessage(request);
            this.awaitingResponse.set(request.id, resolve);
        });
    }

    messages = (): Promise<Message[]> => {
        return this.request<null, Message[]>({ action: "messages" });
    }
}
