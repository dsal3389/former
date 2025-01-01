type MessageData = 'messages' | 'abort';

export interface Request<T> {
    data: MessageData,
    payload?: T
}

export interface RequestWithId<T> extends Request<T> {
    id: number,
}

export interface Response<T> {
    for_id: number,
    payload: T
}